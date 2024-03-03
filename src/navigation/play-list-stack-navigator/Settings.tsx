import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, ToastAndroid} from 'react-native';
import {Text, TextInput} from 'react-native-paper';
import LoadingView from '../../components/LoadingView';
import Setting from '../../components/Setting';
import ResourceManager from '../../services/ResourceManager';
import SongsController from '../../datastore/SongsController';
import PlayListController from '../../datastore/PlayListController';


function Settings() {
	const [isLoading, setIsLoading] = useState(false);

	const [playListsCount, setPlayListsCount] = useState(0);
	const [songsCount, setSongsCount] = useState(0);
	const [syncID, setSyncID] = useState();
	const [uid, setUID] = useState('');

	// todo: export 3rd database
	const exportData = async () => {
		if (syncID)
			return ToastAndroid.showWithGravity('UID: ' + syncID, ToastAndroid.LONG, ToastAndroid.BOTTOM);

		setIsLoading(true);

		try {
			const res = await ResourceManager.Net.axios({
				data: {
					playLists: await PlayListController.store.findAsync({}),
					songsList: await SongsController.store.findAsync({})
				},
				headers: {
					'Access-Control-Allow-Origin': '*'
				},
				method: 'post',
				responseType: 'json',
				url: '/sync'
			});

			setSyncID(res.data.uid);
			ToastAndroid.showWithGravity('Settings ID: ' + res.data.uid, ToastAndroid.LONG, ToastAndroid.BOTTOM);
		} catch (err) {
			console.error(err);
			ToastAndroid.showWithGravity('Export unsuccessful, try again later', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
		} finally {
			setIsLoading(false);
		}
	};

	const getCounts = async () => {
		setPlayListsCount(await PlayListController.countAsync({}));
		setSongsCount(await SongsController.countAsync({}));
	};

	// todo: import 3rd database
	const importData = async () => {
		if (uid.length > 6)
			setUID(val => val.slice(0, 6));

		if (!uid)
			return ToastAndroid.showWithGravity('UID not specified', ToastAndroid.SHORT, ToastAndroid.BOTTOM);

		if (!/\d{6}/gm.test(uid))
			return ToastAndroid.showWithGravity('Incorrect UID', ToastAndroid.SHORT, ToastAndroid.BOTTOM);

		try {
			const res = await ResourceManager.Net.axios({
				headers: {
					'Access-Control-Allow-Origin': '*'
				},
				method: 'get',
				responseType: 'json',
				url: '/sync/' + uid
			});

			for (const playList of res.data.playLists)
				await PlayListController.store.updateAsync({id: playList.id}, playList, {upsert: true});

			// todo: find a better way to download songs
			// IMPORTANT: update database in case of duplicated song
			for (const song of res.data.songsList) {
				delete song.musicly;
				// todo: restore song's playlists
				const songC = await ResourceManager.Song.create(song);
				songC.getRemoteAudio();
			}
		} catch (err) {
			console.error(err);
			ToastAndroid.showWithGravity('Export unsuccessful, try again later', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
		} finally {
			await getCounts();
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getCounts();
	}, []);

	const exportButtons = [{fun: exportData, icon: 'database-export-outline', name: 'export'}];
	const importButtons = [{fun: importData, icon: 'database-import-outline', name: 'import'}];

	return (
		<LoadingView isLoading={isLoading} title={'Settings'}>
			<Setting buttons={exportButtons} style={css.topSetting}>
				<Text variant={'bodyMedium'}>{playListsCount} PlayLists | {songsCount} Songs</Text>
			</Setting>

			<Setting buttons={importButtons}>
				<SafeAreaView>
					<TextInput dense
							   label={'UID'}
							   mode={'outlined'}
							   onChangeText={setUID}
							   placeholder={'002137'}
							   style={css.textInput}
							   value={uid}/>
				</SafeAreaView>
			</Setting>
		</LoadingView>
	);
}

const css = StyleSheet.create({
	textInput: {
		minWidth: '30%'
	},
	topSetting: {
		marginTop: 5
	}
});

export default Settings;
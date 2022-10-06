import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, ToastAndroid, View} from 'react-native';
import {Text, TextInput} from 'react-native-paper';
import {DownloadType} from '../../../typings/enums';
import LoadingView from '../../components/LoadingView';
import Setting from '../../components/Setting';
import PlayListController from '../../datastore/PlayListController';
import SongsController from '../../datastore/SongsController';
import NetService from '../../services/NetService';


function Sync() {
	const playlistsDB = useRef(new PlayListController());
	const songsDB = useRef(new SongsController());

	const [isLoading, setIsLoading] = useState(false);

	const [playListsCount, setPlayListsCount] = useState(0);
	const [songsCount, setSongsCount] = useState(0);
	const [syncID, setSyncID] = useState();
	const [uid, setUID] = useState('');

	const exportData = async () => {
		if (syncID)
			return ToastAndroid.showWithGravity('Sync ID: ' + syncID, ToastAndroid.LONG, ToastAndroid.BOTTOM);

		setIsLoading(true);

		try {
			const res = await new NetService().REST({
				data: {
					playLists: await playlistsDB.current.db.findAsync({}),
					songsList: await songsDB.current.db.findAsync({})
				},
				headers: {
					'Access-Control-Allow-Origin': '*'
				},
				method: 'post',
				responseType: 'json',
				url: '/sync'
			});

			setSyncID(res.data.uid);
			ToastAndroid.showWithGravity('Sync ID: ' + res.data.uid, ToastAndroid.LONG, ToastAndroid.BOTTOM)
		} catch (err) {
			console.error(err);
			ToastAndroid.showWithGravity('Export unsuccessful, try again later', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
		} finally {
			setIsLoading(false);
		}
	};

	const getCounts = async () => {
		setPlayListsCount(await playlistsDB.current.countAsync({}));
		setSongsCount(await songsDB.current.countAsync({}));
	};

	const importData = async () => {
		if (uid.length > 6)
			setUID(val => val.slice(0, 6));

		if (!uid)
			return ToastAndroid.showWithGravity('UID not specified', ToastAndroid.SHORT, ToastAndroid.BOTTOM);

		if (!/\d{6}/gm.test(uid))
			return ToastAndroid.showWithGravity('Incorrect UID', ToastAndroid.SHORT, ToastAndroid.BOTTOM);

		const net = new NetService();

		try {
			const res = await net.REST({
				headers: {
					'Access-Control-Allow-Origin': '*'
				},
				method: 'get',
				responseType: 'json',
				url: '/sync/' + uid
			});

			for (const playList of res.data.playLists)
				await playlistsDB.current.db.updateAsync({id: playList.id}, playList, {upsert: true});

			// todo: find a better way to download songs
			// todo: !IMPORTANT update database in case of duplicated song
			for (const song of res.data.songsList) {
				const playLists = song.musicly.playlists;
				delete song.musicly;
				net.download(DownloadType.Audio, song, playLists);
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
		<LoadingView isLoading={isLoading} title={'Sync'}>
			<Setting buttons={exportButtons} style={css.topSetting}>
				<Text variant={'bodyMedium'}>{playListsCount} PlayLists | {songsCount} Songs</Text>
			</Setting>

			<Setting buttons={importButtons}>
				<View>
					<SafeAreaView>
						<TextInput dense
								   label={'UID'}
								   mode={'outlined'}
								   onChangeText={setUID}
								   placeholder={'002137'}
								   style={css.textInput}
								   value={uid}/>
					</SafeAreaView>
				</View>
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

export default Sync;
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import React, {useRef, useState} from 'react';
import {StyleSheet, ToastAndroid} from 'react-native';
import {Text} from 'react-native-paper';
import LoadingView from '../../components/LoadingView';
import Setting from '../../components/Setting';
import SongsController from '../../datastore/SongsController';
import ResourceManager from '../../services/ResourceManager';


function Settings() {
	// const playlistsDB = useRef(new PlayListController());
	const songsDB = useRef(new SongsController());

	// const [isLoading, setIsLoading] = useState(false);
	const [reloadingFromDisc, setReloadingFromDisc] = useState(false);

	// const [playListsCount, setPlayListsCount] = useState(0);
	// const [songsCount, setSongsCount] = useState(0);
	// const [syncID, setSyncID] = useState();
	// const [uid, setUID] = useState('');

	// const exportData = async () => {
	// 	if (syncID)
	// 		return ToastAndroid.showWithGravity('UID: ' + syncID, ToastAndroid.LONG, ToastAndroid.BOTTOM);
	//
	// 	setIsLoading(true);
	//
	// 	try {
	// 		const res = await ResourceManager.Net.axios({
	// 			data: {
	// 				playLists: await playlistsDB.current.db.findAsync({}),
	// 				songsList: await songsDB.current.db.findAsync({})
	// 			},
	// 			headers: {
	// 				'Access-Control-Allow-Origin': '*'
	// 			},
	// 			method: 'post',
	// 			responseType: 'json',
	// 			url: '/sync'
	// 		});
	//
	// 		setSyncID(res.data.uid);
	// 		ToastAndroid.showWithGravity('Settings ID: ' + res.data.uid, ToastAndroid.LONG, ToastAndroid.BOTTOM);
	// 	} catch (err) {
	// 		console.error(err);
	// 		ToastAndroid.showWithGravity('Export unsuccessful, try again later', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
	// 	} finally {
	// 		setIsLoading(false);
	// 	}
	// };

	// const getCounts = async () => {
	// 	setPlayListsCount(await playlistsDB.current.countAsync({}));
	// 	setSongsCount(await songsDB.current.countAsync({}));
	// };

	// const importData = async () => {
	// 	if (uid.length > 6)
	// 		setUID(val => val.slice(0, 6));
	//
	// 	if (!uid)
	// 		return ToastAndroid.showWithGravity('UID not specified', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
	//
	// 	if (!/\d{6}/gm.test(uid))
	// 		return ToastAndroid.showWithGravity('Incorrect UID', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
	//
	// 	try {
	// 		const res = await ResourceManager.Net.axios({
	// 			headers: {
	// 				'Access-Control-Allow-Origin': '*'
	// 			},
	// 			method: 'get',
	// 			responseType: 'json',
	// 			url: '/sync/' + uid
	// 		});
	//
	// 		for (const playList of res.data.playLists)
	// 			await playlistsDB.current.db.updateAsync({id: playList.id}, playList, {upsert: true});
	//
	// 		// todo: find a better way to download songs
	// 		// IMPORTANT: update database in case of duplicated song
	// 		for (const song of res.data.songsList) {
	// 			delete song.musicly;
	// 			// todo: restore song's playlists
	// 			const songC = await ResourceManager.Song.create(song);
	// 			songC.getRemoteAudio();
	// 		}
	// 	} catch (err) {
	// 		console.error(err);
	// 		ToastAndroid.showWithGravity('Export unsuccessful, try again later', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
	// 	} finally {
	// 		await getCounts();
	// 		setIsLoading(false);
	// 	}
	// };

	const reloadMusic = async () => {
		const {status} = await MediaLibrary.requestPermissionsAsync();
		if (status !== MediaLibrary.PermissionStatus.GRANTED)
			return ToastAndroid.showWithGravity('Missing media library permission.', ToastAndroid.LONG, ToastAndroid.BOTTOM);

		setReloadingFromDisc(true);

		const assetsToValidate = [];

		const assets = (await MediaLibrary.getAssetsAsync({
			first: 1000,
			mediaType: 'audio'
		})).assets.filter(asset => asset.filename.endsWith('.wav'));

		for (const asset of assets) {
			const assetID = asset.filename.slice(0, asset.filename.lastIndexOf('.'));
			if (await songsDB.current.countAsync({id: assetID}) === 0)
				assetsToValidate.push(assetID);
		}

		if (assetsToValidate.length === 0) {
			setReloadingFromDisc(false);
			return ToastAndroid.showWithGravity(`There Are No New Songs On Disc`, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
		}

		try {
			const res = await ResourceManager.Net.axios({
				data: assetsToValidate,
				method: 'post',
				responseType: 'json',
				url: '/v2/content/check'
			});

			ToastAndroid.showWithGravity(`Found ${res.data.length} New Songs`, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
			if (res.data.length !== 0)
				for (const songMetadata of res.data) {
					const asset = assets.find(asset => asset.filename === songMetadata.id + '.wav');
					const {size} = await FileSystem.getInfoAsync(asset!.uri);

					await ResourceManager.Song.create(songMetadata, {
						file: {
							downloadDate: new Date(asset!.creationTime),
							id: asset!.id,
							path: asset!.uri,
							size
						}
					});
				}
		} catch (err) {
			console.error(err);
			ToastAndroid.showWithGravity('Cannot Check Songs IDs: Incorrect Server Response', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
		} finally {
			setReloadingFromDisc(false);
		}
	};

	// useEffect(() => {
	// 	getCounts();
	// }, []);

	const buttons = useRef({
		// export: [{fun: exportData, icon: 'database-export-outline', name: 'export'}],
		// import: [{fun: importData, icon: 'database-import-outline', name: 'import'}],
		reload: [{fun: reloadMusic, icon: 'cached', name: 'reload'}]
	});

	return (
		<LoadingView isLoading={/* isLoading */ false} title={'Settings'}>
			{/*<Setting buttons={exportButtons} style={css.topSetting}>*/}
			{/*	<Text variant={'bodyMedium'}>{playListsCount} PlayLists | {songsCount} Songs</Text>*/}
			{/*</Setting>*/}

			{/*<Setting buttons={importButtons}>*/}
			{/*	<SafeAreaView>*/}
			{/*		<TextInput dense*/}
			{/*				   label={'UID'}*/}
			{/*				   mode={'outlined'}*/}
			{/*				   onChangeText={setUID}*/}
			{/*				   placeholder={'002137'}*/}
			{/*				   style={css.textInput}*/}
			{/*				   value={uid}/>*/}
			{/*	</SafeAreaView>*/}
			{/*</Setting>*/}

			<Setting buttons={buttons.current.reload} isLoading={reloadingFromDisc} style={css.topSetting}>
				<Text variant={'bodyMedium'}>Reload Music from Disc</Text>
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
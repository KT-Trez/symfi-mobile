import {NavigationContext} from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import {PermissionStatus} from 'expo-media-library';
import React, {useEffect, useRef, useState} from 'react';
import {ToastAndroid} from 'react-native';
import {SavedSongMetadata} from '../../../typings/interfaces';
import ManageDialog from '../../components/ManageDialog';
import PlayListController from '../../datastore/PlayListController';
import SongsController from '../../datastore/SongsController';
import useAssetRemoval from '../../hooks/useAssetRemoval';
import {dbs} from '../../datastore/Store';


interface EditDialogProps {
	playingSongID: string | undefined;
	refreshSongsList: () => void;
	setSongID: (id: string | undefined) => void;
	songID: string | undefined;
}

function EditDialog({playingSongID, refreshSongsList, setSongID, songID}: EditDialogProps) {
	// constants
	const navigation = React.useContext(NavigationContext);

	const playlistsDB = useRef(new PlayListController());
	const songsDB = useRef(new SongsController());

	// flags
	const [isVisible, setIsVisible] = useState(false);

	// methods
	const editSong = () => {
		navigation?.navigate('SongEdit', {id: songID});
		hideDialog();
	};

	const hideDialog = () => {
		setSongID(undefined);
		setIsVisible(false);
	};

	// todo: load song from DB
	const removeSong = async () => {
		// check if songID exists; get android permissions; check is song is currently playing
		if (!songID)
			return;

		const {status} = await MediaLibrary.requestPermissionsAsync();
		if (status !== PermissionStatus.GRANTED)
			return ToastAndroid.showWithGravity('No permission to delete audio file', ToastAndroid.LONG, ToastAndroid.BOTTOM);

		if (songID === playingSongID)
			return ToastAndroid.showWithGravity('Song is currently playing', ToastAndroid.SHORT, ToastAndroid.BOTTOM);

		// todo: update schema
		// todo: check if resource is downloaded
		try {
			// get song and it's file metadata
			const song = await songsDB.current.db.findOneAsync({id: songID}) as SavedSongMetadata;
			const asset = await MediaLibrary.getAssetInfoAsync(song.musicly.file.id!);

			// delete song and it's cover
			await MediaLibrary.deleteAssetsAsync(asset);
			if (song.musicly.flags.hasCover)
				await useAssetRemoval(song.musicly.cover.uri!);

			// decrease songsCount and remove from playLists
			await playlistsDB.current.decreaseSongsCount(song.musicly.playlists);
			await dbs.songPlayLists.removeAsync({songID})
		} catch (err) {
			// handle missing id in old db entries
			ToastAndroid.showWithGravity('Insufficient data, please delete audio file manually from file system', ToastAndroid.LONG, ToastAndroid.BOTTOM);
		} finally {
			// remove from db
			await songsDB.current.db.remove({id: songID}, {});

			refreshSongsList();
			hideDialog();
		}
	};

	const showDialog = () => setIsVisible(true);

	// effects
	useEffect(() => {
		if (songID)
			showDialog();
	}, [songID]);

	return (
		<ManageDialog hide={hideDialog}
					  isVisible={isVisible}
					  onCancel={hideDialog}
					  onDelete={removeSong}
					  onEdit={editSong}
					  resourceName={'song'}/>
	);
}

export default EditDialog;
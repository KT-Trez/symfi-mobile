import {NavigationContext} from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import {PermissionStatus} from 'expo-media-library';
import React, {useEffect, useRef, useState} from 'react';
import {ToastAndroid} from 'react-native';
import {SavedSongMetadata} from '../../../../typings/interfaces';
import useAssetRemoval from '../../../hooks/useAssetRemoval';
import {SongsDatabase} from '../../../schemas/schemas';
import ManageDialog from '../ManageDialog';


interface DeleteDialogProps {
	playingSongID: string | undefined;
	refreshSongsList: () => void;
	setSongID: (id: string | undefined) => void;
	songID: string | undefined;
	// todo: remove useless params
	songs: SavedSongMetadata[];
}

function EditDialog({playingSongID, refreshSongsList, setSongID, songID, songs}: DeleteDialogProps) {
	const navigation = React.useContext(NavigationContext);

	const songsDB = useRef(SongsDatabase.getInstance());

	const [deleteSong, setDeleteSong] = useState<SavedSongMetadata | undefined>(undefined);
	const [isVisible, setIsVisible] = useState(false);

	const editResource = () => {
		navigation?.navigate('SongEdit', {id: songID});
		hideDialog();
	};

	const hideDialog = () => {
		setDeleteSong(undefined);
		setSongID(undefined);

		setIsVisible(false);
	};

	// todo: load song from DB
	const removeSong = async () => {
		if (!deleteSong)
			return;

		const {status} = await MediaLibrary.requestPermissionsAsync();
		if (status !== PermissionStatus.GRANTED)
			return ToastAndroid.showWithGravity('No permission to delete audio file', ToastAndroid.LONG, ToastAndroid.BOTTOM);

		if (deleteSong?.id === playingSongID)
			return ToastAndroid.showWithGravity('Song is currently playing', ToastAndroid.SHORT, ToastAndroid.BOTTOM);

		// todo: update schema
		// todo: check if resource is downloaded
		const asset = await MediaLibrary.getAssetInfoAsync(deleteSong!.musicly.file.path!);
		await MediaLibrary.deleteAssetsAsync(asset);
		if (deleteSong.musicly.flags.hasCover)
			await useAssetRemoval(deleteSong.musicly.cover.uri!);

		await songsDB.current.remove({id: deleteSong!.id}, {});

		refreshSongsList();
		hideDialog();
	};

	const showDialog = () => setIsVisible(true);

	useEffect(() => {
		if (deleteSong)
			showDialog();
	}, [deleteSong]);

	useEffect(() => {
		if (songID)
			setDeleteSong(songs.find(song => song.id === songID));
	}, [songID]);

	return (
		<ManageDialog hide={hideDialog}
					  isVisible={isVisible}
					  name={'song'}
					  onCancel={hideDialog}
					  onDelete={removeSong}
					  onEdit={editResource}/>
	);
}

export default EditDialog;
import {PermissionStatus} from 'expo-media-library';
import * as MediaLibrary from 'expo-media-library';
import React, {useEffect, useRef, useState} from 'react';
import {ToastAndroid} from 'react-native';
import {Button, Dialog, Paragraph, Portal} from 'react-native-paper';
import {SavedSongMetadata} from '../../../../typings/interfaces';
import {SongsDatabase} from '../../../schemas/schemas';

interface DeleteDialogProps {
	deleteSongID: string | undefined;
	playSongID: string | undefined;
	refreshSongsList: () => void;
	setDeleteSongID: (id: string | undefined) => void;
	songs: SavedSongMetadata[];
}

function DeleteDialog({deleteSongID, playSongID, refreshSongsList, setDeleteSongID, songs}: DeleteDialogProps) {
	const songsDB = useRef(SongsDatabase.getInstance());

	const [deleteSong, setDeleteSong] = useState<SavedSongMetadata | undefined>(undefined);
	const [isVisible, setIsVisible] = useState(false);

	const hideDialog = () => {
		setDeleteSong(undefined);
		setDeleteSongID(undefined);

		setIsVisible(false);
	};

	const removeResource = async () => {
		if (!deleteSong)
			return;

		const {status} = await MediaLibrary.requestPermissionsAsync();
		if (status !== PermissionStatus.GRANTED)
			return ToastAndroid.showWithGravity('No permission to delete audio file', ToastAndroid.LONG, ToastAndroid.BOTTOM);

		if (deleteSong?.id === playSongID)
			return ToastAndroid.showWithGravity('Song is currently playing', ToastAndroid.SHORT, ToastAndroid.BOTTOM);

		// todo: update schema
		// todo: check if resource is downloaded
		const asset = await MediaLibrary.getAssetInfoAsync(deleteSong!.musicly.file.path!);
		await MediaLibrary.deleteAssetsAsync(asset);

		await songsDB.current.remove({id: deleteSong!.id}, {});

		refreshSongsList();
		hideDialog();
	};

	const showDialog = () => setIsVisible(true);

	useEffect(() => {
		if (deleteSongID)
			setDeleteSong(songs.find(song => song.id === deleteSongID));
	}, [deleteSongID]);

	useEffect(() => {
		if (deleteSong)
			showDialog();
	}, [deleteSong]);

	return (
		<Portal>
			<Dialog dismissable={true} onDismiss={hideDialog} visible={isVisible}>
				<Dialog.Title>Delete</Dialog.Title>
				<Dialog.Content>
					<Paragraph>Do you want to delete this audio file?</Paragraph>
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={hideDialog}>Cancel</Button>
					<Button onPress={removeResource}>Delete</Button>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	);
}

export default DeleteDialog;
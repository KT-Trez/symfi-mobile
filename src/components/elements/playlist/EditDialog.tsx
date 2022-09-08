import {NavigationContext} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Button, Dialog, Paragraph, Portal} from 'react-native-paper';
import {PlaylistData, SavedSongMetadata} from '../../../../typings/interfaces';
import {PlaylistDatabase, SongsDatabase} from '../../../schemas/schemas';


interface DeleteDialogProps {
	playlistID: string | undefined;
	refreshPlaylistsList: () => void;
	setPlaylistID: (id: string | undefined) => void;
}

function EditDialog({playlistID, refreshPlaylistsList, setPlaylistID}: DeleteDialogProps) {
	const navigation = React.useContext(NavigationContext);

	const playlistsDB = useRef(PlaylistDatabase.getInstance());
	const songsDB = useRef(SongsDatabase.getInstance());

	const [isVisible, setIsVisible] = useState(false);

	const editPlaylist = () => {
		navigation?.navigate('PlaylistEdit', {id: playlistID});
		hideDialog();
	};

	const hideDialog = () => {
		setPlaylistID(undefined);
		setIsVisible(false);
	};

	const removePlayList = async () => {
		if (!playlistID)
			return;

		await playlistsDB.current.remove({id: playlistID}, {});

		const songs = await songsDB.current.find<SavedSongMetadata[]>({'musicly.playlists.id': playlistID});
		for (const song of songs) {
			const playlistObject = (await songsDB.current.findOne({id: song.id})).musicly.playlists.find((p: PlaylistData) => p.id === playlistID);
			await songsDB.current.update({id: song.id}, {$pull: {'musicly.playlists': playlistObject}}, {});
		}

		refreshPlaylistsList();
		hideDialog();
	};

	const showDialog = () => setIsVisible(true);

	useEffect(() => {
		if (playlistID)
			showDialog();
	}, [playlistID]);

	// todo: implement manage dialog
	return (
		<Portal>
			<Dialog dismissable={true} onDismiss={hideDialog} visible={isVisible}>
				<Dialog.Title>Manage</Dialog.Title>
				<Dialog.Content>
					<Paragraph>Do you want to delete/edit this playlist?</Paragraph>
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={hideDialog}>Cancel</Button>
					<Button onPress={removePlayList}>Delete</Button>
					<Button onPress={editPlaylist}>Edit</Button>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	);
}

export default EditDialog;
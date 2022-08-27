import React, {useEffect, useRef, useState} from 'react';
import {Button, Dialog, Paragraph, Portal} from 'react-native-paper';
import {PlaylistData, SavedSongMetadata} from '../../../../typings/interfaces';
import {PlaylistDatabase, SongsDatabase} from '../../../schemas/schemas';


interface DeleteDialogProps {
	playlistID: string;
	refreshPlaylistsList: () => void;
}

function DeleteDialog({playlistID, refreshPlaylistsList}: DeleteDialogProps) {
	// todo: !IMPORTANT - test and implement

	const playlistsDB = useRef(PlaylistDatabase.getInstance());
	const songsDB = useRef(SongsDatabase.getInstance());

	const [isVisible, setIsVisible] = useState(false);

	const hideDialog = () => {
		setIsVisible(false);
	};

	const removePlaylist = async () => {
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

	return (
		<Portal>
			<Dialog dismissable={true} onDismiss={hideDialog} visible={isVisible}>
				<Dialog.Title>Delete</Dialog.Title>
				<Dialog.Content>
					<Paragraph>Do you want to delete this playlist?</Paragraph>
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={hideDialog}>Cancel</Button>
					<Button onPress={removePlaylist}>Delete</Button>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	);
}

export default DeleteDialog;
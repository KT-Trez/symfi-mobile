import {NavigationContext} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {SavedSongMetadata} from '../../../typings/interfaces';
import ManageDialog from '../../components/ManageDialog';
import PlayListController from '../../datastore/PlayListController';
import SongsController from '../../datastore/SongsController';


interface EditDialogProps {
	playlistID: string | undefined;
	refreshPlaylistsList: () => void;
	setPlaylistID: (id: string | undefined) => void;
}

function EditDialog({playlistID, refreshPlaylistsList, setPlaylistID}: EditDialogProps) {
	const navigation = React.useContext(NavigationContext);

	const playlistsDB = useRef(new PlayListController());
	const songsDB = useRef(new SongsController());

	const [isVisible, setIsVisible] = useState(false);

	const editPlayList = () => {
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

		await playlistsDB.current.db.removeAsync({id: playlistID}, {});

		const songs = await songsDB.current.db.findAsync({'musicly.playlists.id': playlistID}) as SavedSongMetadata[];
		for (const song of songs)
			await songsDB.current.removePlayListFromSong(playlistID, song.id);

		refreshPlaylistsList();
		hideDialog();
	};

	const showDialog = () => setIsVisible(true);

	useEffect(() => {
		if (playlistID)
			showDialog();
	}, [playlistID]);

	return (
		<ManageDialog hide={hideDialog}
					  isVisible={isVisible}
					  onCancel={hideDialog}
					  onDelete={removePlayList}
					  onEdit={editPlayList}
					  resourceName={'playlist'}/>
	);
}

export default EditDialog;
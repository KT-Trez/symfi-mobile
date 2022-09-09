import React, {useRef} from 'react';
import {SavedSongMetadata} from '../../../typings/interfaces';
import SongEntry from '../../components/SongEntry';
import PlayListController from '../../datastore/PlayListController';
import SongsController from '../../datastore/SongsController';


interface SongProps {
	item: SavedSongMetadata;
	loadToPlay: (id: string) => void;
	playlistID: string;
	refreshPlaylist: () => void;
}

function Song({item, loadToPlay, playlistID, refreshPlaylist}: SongProps) {
	const playlistDB = useRef(new PlayListController());
	const songsDB = useRef(new SongsController());

	const playAudio = () => {
		// todo: update flag for existing resources
		//if (!item.musicly.flags.isDownloaded)
		//	return;

		loadToPlay(item.id);
	};

	// todo: !IMPORTANT fix songs count
	const removeFromPlayList = async () => {
		await songsDB.current.removePlayListFromSong(playlistID, item.id);
		await playlistDB.current.db.updateAsync({id: playlistID}, {$inc: {songsCount: -1}}, {});
		refreshPlaylist();
	};

	return (
		<SongEntry item={item}
				   onLongPress={removeFromPlayList}
				   onPress={playAudio}/>
	);
}

export default Song;
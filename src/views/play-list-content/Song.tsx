import React from 'react';
import {SavedSongMetadata} from '../../../typings/interfaces';
import SongEntry from '../../components/SongEntry';


interface SongProps {
	item: SavedSongMetadata;
	loadToPlay: (id: string) => void;
	loadToRemove: (song: SavedSongMetadata) => void;
}

function Song({item, loadToPlay, loadToRemove}: SongProps) {
	const playAudio = () => {
		loadToPlay(item.id);
	};

	const removeFromPlayList = async () => {
		loadToRemove(item);
	};

	return (
		<SongEntry item={item}
				   onLongPress={removeFromPlayList}
				   onPress={playAudio}/>
	);
}

export default Song;
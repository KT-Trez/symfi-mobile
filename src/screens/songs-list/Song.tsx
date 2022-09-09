import React from 'react';
import {SavedSongMetadata} from '../../../typings/interfaces';
import SongEntry from '../../components/SongEntry';


interface SongProps {
	item: SavedSongMetadata;
	loadToManage: (id: string) => void;
	loadToPlay: (id: string) => void;
}

function Song({item, loadToPlay, loadToManage}: SongProps) {
	const manageAudio = () => {
		loadToManage(item.id);
	};

	const playAudio = () => {
		loadToPlay(item.id);
	};

	return (
		<SongEntry item={item}
				   onLongPress={manageAudio}
				   onPress={playAudio}/>
	);
}

export default Song;
import React from 'react';
import {SavedSongMetadata} from '../../../../typings/interfaces';
import SongEntry from '../SongEntry';


interface SongItemProps {
	item: SavedSongMetadata;
	loadToManage: (id: string) => void;
	loadToPlay: (id: string) => void;
}

function SavedAudioItem({item, loadToPlay, loadToManage}: SongItemProps) {
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

export default SavedAudioItem;
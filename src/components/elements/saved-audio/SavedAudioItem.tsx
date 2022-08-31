import React from 'react';
import {SavedSongMetadata} from '../../../../typings/interfaces';
import SongEntry from '../SongEntry';


interface SongItemProps {
	item: SavedSongMetadata;
	loadToAudioPlayer: (id: string) => void;
	loadToRemove: (id: string) => void;
}

function SavedAudioItem({item, loadToAudioPlayer, loadToRemove}: SongItemProps) {
	const changeCover = () => {

	};

	const playAudio = () => {
		loadToAudioPlayer(item.id);
	};

	const removeAudio = () => {
		loadToRemove(item.id);
	};

	return (
		<SongEntry imageOnLongPress={changeCover}
				   imageOnPress={playAudio}
				   item={item}
				   textOnPress={playAudio}
				   textOnLongPress={removeAudio}/>
	);
}

export default SavedAudioItem;
import React from 'react';
import {SavedSongMetadata} from '../../../../typings/interfaces';
import SongEntry from '../SongEntry';


interface SongItemProps {
	item: SavedSongMetadata;
	loadToAudioPlayer: (id: string) => void;
	removeResource: (id: string) => void;
}

function SavedAudioItem({item, loadToAudioPlayer, removeResource}: SongItemProps) {
	const changeCover = () => {

	};

	const deleteAudio = () => {
		removeResource(item.id);
	};

	const playAudio = () => {
		loadToAudioPlayer(item.id);
	};

	return (
		<SongEntry imageOnLongPress={changeCover}
				   imageOnPress={playAudio}
				   item={item}
				   textOnPress={playAudio}
				   textOnLongPress={deleteAudio}/>
	);
}

export default SavedAudioItem;
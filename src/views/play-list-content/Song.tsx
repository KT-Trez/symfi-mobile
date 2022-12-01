import React from 'react';
import SongEntry from '../../components/SongEntry';
import {Song as SongC} from '../../services/ResourceManager';


interface SongProps {
	item: SongC;
	loadToPlay: (id: string) => void;
	loadToRemove: (song: SongC) => void;
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
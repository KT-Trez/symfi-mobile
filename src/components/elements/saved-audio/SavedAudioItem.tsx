import React, {useRef} from 'react';
import {SavedSongMetadata} from '../../../../typings/interfaces';
import useImagePicker from '../../../hooks/useImagePicker';
import {SongsDatabase} from '../../../schemas/schemas';
import SongEntry from '../SongEntry';


interface SongItemProps {
	item: SavedSongMetadata;
	loadToAudioPlayer: (id: string) => void;
	loadToRemove: (id: string) => void;
}

function SavedAudioItem({item, loadToAudioPlayer, loadToRemove}: SongItemProps) {
	const songsDB = useRef(SongsDatabase.getInstance());

	const changeCover = async () => {
		const [uri, isCanceled] = await useImagePicker(item.id, [16, 9]);

		if (isCanceled)
			return;

		await songsDB.current.update({id: item.id}, {
			$set: {
				'musicly.cover.uri': uri,
				'musicly.flags.hasCover': true
			}
		}, {});
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
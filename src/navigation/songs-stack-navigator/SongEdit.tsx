import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Text} from 'react-native-paper';
import {SavedSongMetadata} from '../../../typings/interfaces';
import {RootSongsStackParamList} from '../../../typings/navigation';
import CoverChangeMenu from '../../components/elements/CoverChangeMenu';
import LoadingView from '../../components/elements/LoadingView';
import SongsController from '../../datastore/SongsController';
import useAssetRemoval from '../../hooks/useAssetRemoval';
import useImagePicker from '../../hooks/useImagePicker';


type ProfileScreenRouteProp = RouteProp<RootSongsStackParamList, 'SongEdit'>;

function SongEdit() {
	// constants
	const route = useRoute<ProfileScreenRouteProp>();
	const songID = route.params?.id;

	const songsDB = useRef(new SongsController);

	// flags
	const [isLoading, setIsLoading] = useState(false);

	// song metadata
	const [song, setSong] = useState<SavedSongMetadata | undefined>(undefined);

	// methods
	const changeCover = async () => {
		if (!song)
			return;

		const [uri, isCanceled] = await useImagePicker(songID, [16, 9]);

		if (isCanceled)
			return;

		await songsDB.current.updateCover(songID, uri);
		await getSong();
	};

	const getSong = useCallback(async () => {
		setIsLoading(true);
		setSong(await songsDB.current.db.findOneAsync({id: songID}) as SavedSongMetadata);
		setIsLoading(false);
	}, []);

	const removeCover = async () => {
		if (!song || !song.musicly.flags.hasCover)
			return;

		await useAssetRemoval(song.musicly.cover.uri!);
		await songsDB.current.updateCover(songID);
		await getSong();
	};

	// effects
	useEffect(() => {
		if (songID)
			getSong();
	}, []);

	return (
		<LoadingView isLoading={isLoading} title={'Edit song'}>
			<CoverChangeMenu aspectRatio={1.77}
							 borderRadius={0}
							 coverUri={song?.musicly.cover.uri ?? undefined}
							 hasCover={song?.musicly.flags.hasCover ?? false}
							 onChange={changeCover}
							 onRemove={removeCover}/>

			<Text>Song edit</Text>
		</LoadingView>
	);
}

export default SongEdit;
import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Text} from 'react-native-paper';
import {SavedSongMetadata} from '../../../types/interfaces';
import {RootSongsStackParamList} from '../../../types/navigation';
import CoverChange from '../../components/CoverChange';
import LoadingView from '../../components/LoadingView';
import Setting from '../../components/Setting';
import useAssetRemoval from '../../hooks/useAssetRemoval';
import useImagePicker from '../../hooks/useImagePicker';
import ResourceManager from '../../services/ResourceManager';
import SongsController from '../../datastore/SongsController';


type ProfileScreenRouteProp = RouteProp<RootSongsStackParamList, 'SongEdit'>;

function SongEdit() {
	// constants
	const route = useRoute<ProfileScreenRouteProp>();
	const songID = route.params?.id;

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

		await SongsController.updateCover(songID, uri);
		await getSong();
	};

	const getOriginalCover = async () => {
		const songResource = await ResourceManager.Song.deserialize(songID);
		await songResource.getRemoteCover(song?.metadata.thumbnails[0].url!);
		await getSong();
	};

	const getSong = useCallback(async () => {
		setIsLoading(true);
		setSong(await SongsController.store.findOneAsync({id: songID}) as SavedSongMetadata);
		setIsLoading(false);
	}, []);

	const removeCover = async () => {
		if (!song || !song.musicly.flags.hasCover)
			return;

		await useAssetRemoval(song.musicly.cover.uri!);
		await SongsController.updateCover(songID);
		await getSong();
	};

	// effects
	useEffect(() => {
		if (songID)
			getSong();
	}, []);

	return (
		<LoadingView isLoading={isLoading} title={'Edit song'}>
			<CoverChange aspectRatio={1.77}
						 borderRadius={0}
						 coverUri={song?.musicly.cover.uri}
						 hasCover={song?.musicly.flags.hasCover ?? false}
						 onChange={changeCover}
						 onRemove={removeCover}/>

			<Setting buttons={[
				{fun: getOriginalCover, icon: 'file-download-outline', name: 'Original'}
			]}>
				<Text variant={'titleSmall'}>Get original cover</Text>
			</Setting>
		</LoadingView>
	);
}

export default SongEdit;
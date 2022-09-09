import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Button, Surface, Text, TextInput} from 'react-native-paper';
import {PlaylistMetadata} from '../../../typings/interfaces';
import {RootPlayListsStackParamList} from '../../../typings/navigation';
import CoverChange from '../../components/CoverChange';
import LoadingView from '../../components/LoadingView';
import PlayListController from '../../datastore/PlayListController';
import useAssetRemoval from '../../hooks/useAssetRemoval';
import useImagePicker from '../../hooks/useImagePicker';


type ProfileScreenRouteProp = RouteProp<RootPlayListsStackParamList, 'PlaylistEdit'>;

function PlaylistEdit() {
	// constants
	const route = useRoute<ProfileScreenRouteProp>();
	const playlistID = route.params?.id;

	const playlistDB = useRef(new PlayListController());

	// flags
	const [isLoading, setIsLoading] = useState(false);

	// playlist metadata
	const [name, setName] = useState('');
	const [playlist, setPlaylist] = useState<PlaylistMetadata | undefined>();

	// methods
	const cancelName = () => {
		setName('');
	};

	const changeCover = async () => {
		const [uri, isCanceled] = await useImagePicker(playlistID, [1, 1]);

		if (isCanceled)
			return;

		await playlistDB.current.updateCover(playlistID, uri);
		await getPlaylist();
	};

	const changeName = useCallback(async () => {
		if (!name)
			return;

		await playlistDB.current.db.updateAsync({id: playlistID}, {$set: {name: name}}, {});
		await getPlaylist();
	}, [name]);


	const getPlaylist = useCallback(async () => {
		setIsLoading(true);
		setPlaylist(await playlistDB.current.db.findOneAsync({id: playlistID}) as PlaylistMetadata);
		setIsLoading(false);
	}, []);

	const removeCover = async () => {
		if (!playlist || !playlist.flags.hasCover)
			return;

		await useAssetRemoval(playlist.cover.uri!);
		await playlistDB.current.updateCover(playlistID);
		await getPlaylist();
	};

	// effects
	useEffect(() => {
		if (playlistID)
			getPlaylist();
	}, []);

	return (
		<LoadingView isLoading={isLoading} title={'Edit playlist'}>
			{/* todo: change to reusable component */}
			<Surface style={css.containerNameChange}>
				<Text variant={'titleMedium'}>Change name:</Text>

				<SafeAreaView>
					<TextInput dense
							   label={playlist?.name ?? '- none -'}
							   mode={'outlined'}
							   onChangeText={setName}
							   placeholder={'with a dedication to Cristiana'}
							   value={name}/>
				</SafeAreaView>

				<View style={css.containerButtons}>
					<Button onPress={cancelName}>Cancel</Button>
					<Button onPress={changeName}>Save</Button>
				</View>
			</Surface>

			<CoverChange aspectRatio={1}
						 borderRadius={25}
						 coverUri={playlist?.cover.uri}
						 hasCover={playlist?.flags.hasCover ?? false}
						 onChange={changeCover}
						 onRemove={removeCover}/>
		</LoadingView>
	);
}

const css = StyleSheet.create({
	containerButtons: {
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	containerNameChange: {
		margin: 5,
		padding: 10
	}
});

export default PlaylistEdit;
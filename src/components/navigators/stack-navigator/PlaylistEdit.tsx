import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Appbar, Avatar, Button, Surface, Text, TextInput} from 'react-native-paper';
import {PlaylistMetadata} from '../../../../typings/interfaces';
import {RootStackParamList} from '../../../../typings/navigation';
import useAssetRemoval from '../../../hooks/useAssetRemoval';
import useImagePicker from '../../../hooks/useImagePicker';
import {PlaylistDatabase} from '../../../schemas/schemas';


type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'PlaylistEdit'>;

function PlaylistEdit() {
	const route = useRoute<ProfileScreenRouteProp>();
	const playlistID = route.params?.id;

	const playlistDB = useRef(PlaylistDatabase.getInstance());

	const [playlist, setPlaylist] = useState<PlaylistMetadata | undefined>();
	const [name, setName] = useState('');

	const [isLoading, setIsLoading] = useState(false);

	const cancelName = () => {
		setName('');
	};

	const changeCover = async () => {
		const [uri, isCanceled] = await useImagePicker(playlistID, [1, 1]);

		if (isCanceled)
			return;

		await playlistDB.current.update({id: playlistID}, {
			$set: {
				'cover.uri': uri,
				'flags.hasCover': true
			}
		}, {});
		await getPlaylist();
	};


	const getPlaylist = useCallback(async () => {
		setIsLoading(true);
		setPlaylist(await playlistDB.current.findOne({id: playlistID}) as PlaylistMetadata);
		setIsLoading(false);
	}, []);

	const removeCover = async () => {
		if (!playlist || !playlist.flags.hasCover)
			return;

		await useAssetRemoval(playlist.cover.uri!);

		await playlistDB.current.update({id: playlistID}, {
			$set: {
				'cover.uri': undefined,
				'flags.hasCover': false
			}
		}, {});
		await getPlaylist();
	};

	const saveName = useCallback(async () => {
		if (!name)
			return;

		await playlistDB.current.update({id: playlistID}, {$set: {name: name}}, {});
		setPlaylist(await playlistDB.current.findOne({id: playlistID}) as PlaylistMetadata);
	}, [name]);

	useEffect(() => {
		if (playlistID)
			getPlaylist();
	}, []);

	return (
		<View style={css.container}>
			<Appbar.Header elevated mode={'small'}>
				<Appbar.Content title={'Edit playlist'}/>
			</Appbar.Header>

			{!isLoading ?
				<React.Fragment>
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
							<Button onPress={saveName}>Save</Button>
						</View>
					</Surface>

					<Surface style={css.containerImageChange}>
						{playlist?.flags.hasCover ?
							<Avatar.Image size={50}
										  source={
											  ({size}) => <Image resizeMode={'center'}
																 source={{
																	 height: size,
																	 uri: playlist.cover.uri,
																	 width: size
																 }}
																 style={css.image}/>}/>
							:
							<Avatar.Icon icon={'file-image-plus-outline'} size={50}/>
						}

						<View style={css.containerButtons}>
							<Button onPress={removeCover}>Remove</Button>
							<Button onPress={changeCover}>{playlist?.flags.hasCover ? 'Change' : 'Add'}</Button>
						</View>
					</Surface>
				</React.Fragment>
				:
				<ActivityIndicator size={'large'} style={css.activityIndicator}/>
			}
		</View>
	);
}

const css = StyleSheet.create({
	activityIndicator: {
		marginTop: 10
	},
	container: {
		flex: 1
	},
	containerButtons: {
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	containerImageChange: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		margin: 5,
		padding: 10
	},
	containerImageMissing: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	containerNameChange: {
		margin: 5,
		padding: 10
	},
	image: {
		borderRadius: 50
	},
	textMissingCover: {
		color: 'gray'
	}
});

export default PlaylistEdit;
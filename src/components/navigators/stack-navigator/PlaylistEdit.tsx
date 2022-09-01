import {MaterialIcons} from '@expo/vector-icons';
import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Image, SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ActivityIndicator, Appbar, Button, Surface, Text, TextInput} from 'react-native-paper';
import {PlaylistMetadata} from '../../../../typings/interfaces';
import {RootStackParamList} from '../../../../typings/navigation';
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

	const getPlaylist = useCallback(async () => {
		setIsLoading(true);
		setPlaylist(await playlistDB.current.findOne({id: playlistID}) as PlaylistMetadata);
		setIsLoading(false);
	}, []);

	const saveName = useCallback(async () => {
		if (!name)
			return;

		await playlistDB.current.update({id: playlistID}, {$set: {name: name}}, {});
		setPlaylist(await playlistDB.current.findOne({id: playlistID}) as PlaylistMetadata);

		route.params.refreshList();
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
					<Surface style={css.containerInfo}>
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
					<TouchableOpacity style={css.containerImage}>
						{playlist?.flags.hasCover ?
							<Image source={{uri: playlist.cover.uri}}/>
							:
							<View style={css.containerImageMissing}>
								<MaterialIcons color={'gray'} name='image' size={30}/>
								<Text style={css.textMissingCover} variant={'labelSmall'}>Add cover</Text>
							</View>
						}
					</TouchableOpacity>
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
	containerImage: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
		margin: 5,
		padding: 10
	},
	containerImageMissing: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	containerInfo: {
		margin: 5,
		padding: 10
	},
	textMissingCover: {
		color: 'gray'
	}
});

export default PlaylistEdit;
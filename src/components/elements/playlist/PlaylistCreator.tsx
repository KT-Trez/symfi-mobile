import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, FAB, Modal, Portal, Text, TextInput} from 'react-native-paper';
import {PlaylistMetadata} from '../../../../typings/interfaces';
import {PlaylistDatabase} from '../../../schemas/schemas';


interface AlbumCreatorProps {
	reloadList?: () => void;
}

function PlaylistCreator({reloadList}: AlbumCreatorProps) {
	const [isVisible, setIsVisible] = useState(false);

	const [name, setName] = useState('');

	const hideCreator = () => setIsVisible(false);

	const showCreator = () => setIsVisible(true);

	const createAlbum = async () => {
		if (!name)
			return;

		const albumID = new Date().getTime() + Math.round(Math.random() * 1000).toString();

		const db = PlaylistDatabase.getInstance();
		await db.insert<PlaylistMetadata>({
			id: albumID,
			cover: {
				name: albumID + '_cover_' + name,
				uri: undefined
			},
			flags: {
				hasCover: false
			},
			name,
			order: await PlaylistDatabase.getInstance().count({}),
			songsCount: 0,
			version: 1
		});

		if (reloadList)
			reloadList();
		hideCreator();
	};

	return (
		<Portal>
			<Modal contentContainerStyle={css.modalContainer} onDismiss={hideCreator} visible={isVisible}>
				<Text style={css.title} variant={'titleMedium'}>Create new playlist</Text>
				<TextInput dense
						   label={'type in name'}
						   mode={'outlined'}
						   onChangeText={setName}
						   placeholder={'oh lovely Cristiana'}/>
				<View style={css.buttonContainer}>
					<Button onPress={hideCreator}>Back</Button>
					<Button onPress={createAlbum}>Create</Button>
				</View>
			</Modal>

			<FAB icon={'plus'}
				 onPress={showCreator}
				 style={css.fab}/>
		</Portal>
	);
}

const css = StyleSheet.create({
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginTop: 15
	},
	fab: {
		bottom: 60,
		position: 'absolute',
		right: 10
	},
	modalContainer: {
		backgroundColor: 'white',
		margin: 10,
		padding: 20
	},
	title: {
		marginBottom: 15
	}
});

export default PlaylistCreator;
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, FAB, Modal, Portal, Text, TextInput} from 'react-native-paper';
import {PlaylistMetadata} from '../../../typings/interfaces';
import {PlaylistDatabase} from '../../schemas/schemas';


interface AlbumCreatorProps {
	hideCreator: () => void;
	isVisible: boolean;
	reloadList?: () => void;
	showCreator: () => void;
}

function AlbumCreator({hideCreator, isVisible, showCreator, reloadList}: AlbumCreatorProps) {
	const [name, setName] = useState('');

	const createAlbum = async () => {
		if (!name)
			return;

		const albumID = new Date().getTime() + Math.round(Math.random() * 1000).toString();

		const db = new PlaylistDatabase().init();
		await db.insert<PlaylistMetadata>({
			_id: albumID,
			cover: {
				name: albumID + '_cover_' + name
			},
			name,
			songs: 0
		});

		if (reloadList)
			reloadList();
		hideCreator();
	};

	return (
		<React.Fragment>
			<Portal>
				<Modal contentContainerStyle={css.modalContainer} onDismiss={hideCreator} visible={isVisible}>
					<Text style={css.title} variant={'titleMedium'}>Create new album</Text>
					<TextInput dense
							   label={'Name'}
							   mode={'outlined'}
							   onChangeText={setName}
							   placeholder={'Lovely music about Cristiana\'s beauty'}/>
					<View style={css.buttonContainer}>
						<Button onPress={hideCreator}>Back</Button>
						<Button onPress={createAlbum}>Create</Button>
					</View>
				</Modal>
			</Portal>
			<FAB icon={'plus'}
				 onPress={showCreator}
				 style={css.fab}/>
		</React.Fragment>
	);
}

const css = StyleSheet.create({
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginTop: 15
	},
	fab: {
		bottom: 10,
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

export default AlbumCreator;
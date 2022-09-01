import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Modal, Portal, Text, TextInput} from 'react-native-paper';
import {PlaylistMetadata} from '../../../../typings/interfaces';
import {PlaylistDatabase} from '../../../schemas/schemas';


interface AlbumCreatorProps {
	hide: () => void;
	isVisible: boolean;
	reloadList?: () => void;
}

function PlaylistCreator({hide, isVisible, reloadList}: AlbumCreatorProps) {
	const [name, setName] = useState('');

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
		hide();
	};

	return (
		<React.Fragment>
			<Portal>
				<Modal contentContainerStyle={css.modalContainer} onDismiss={hide} visible={isVisible}>
					<Text style={css.title} variant={'titleMedium'}>Create new playlist</Text>
					<TextInput dense
							   label={'type in name'}
							   mode={'outlined'}
							   onChangeText={setName}
							   placeholder={'oh lovely Cristiana'}/>
					<View style={css.buttonContainer}>
						<Button onPress={hide}>Back</Button>
						<Button onPress={createAlbum}>Create</Button>
					</View>
				</Modal>
			</Portal>
		</React.Fragment>
	);
}

const css = StyleSheet.create({
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginTop: 15
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
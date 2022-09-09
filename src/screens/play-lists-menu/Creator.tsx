import React, {useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Modal, Portal, Text, TextInput, useTheme} from 'react-native-paper';
import PlayListController from '../../datastore/PlayListController';


interface CreatorProps {
	hide: () => void;
	isVisible: boolean;
	reloadList?: () => void;
}

function Creator({hide, isVisible, reloadList}: CreatorProps) {
	// constants
	const {colors} = useTheme();
	const playlistsDB = useRef(new PlayListController());


	const [name, setName] = useState('');

	const createAlbum = async () => {
		if (!name)
			return;

		const id = new Date().getTime() + Math.round(Math.random() * 1000).toString();
		await playlistsDB.current.db.insertAsync({
			id: id,
			cover: {
				name: id + '_cover_' + name,
				uri: undefined
			},
			flags: {
				hasCover: false
			},
			name,
			order: await playlistsDB.current.countAsync({}),
			songsCount: 0,
			version: 1
		});

		if (reloadList)
			reloadList();
		hide();
	};

	return (
		<Portal>
			<Modal contentContainerStyle={[css.modal, {backgroundColor: colors.elevation.level3}]}
				   onDismiss={hide} visible={isVisible}>
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
	);
}

const css = StyleSheet.create({
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginTop: 15
	},
	modal: {
		backgroundColor: 'white',
		margin: 10,
		padding: 20
	},
	title: {
		marginBottom: 15
	}
});

export default Creator;
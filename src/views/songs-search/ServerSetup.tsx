import React, {useCallback, useEffect, useState} from 'react';
import {Button, Modal, Portal, Text, TextInput, useTheme} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ResourceManager from '../../services/ResourceManager';
import {StyleSheet, View} from 'react-native';


interface ServerSetUpProps {
	hide: () => void;
	shows: boolean;
}

function ServerSetup({hide, shows}: ServerSetUpProps) {
	const {colors} = useTheme();

	const [remote, setRemote] = useState('');

	const changeRemote = () => {
		if (!remote)
			return;
		ResourceManager.Net.changeRemote(remote);
		hide();
	};

	const getCurrentRemote = useCallback(async () => {
		setRemote(await AsyncStorage.getItem('remote') ?? '');
	}, []);

	useEffect(() => {
		getCurrentRemote();
	}, []);

	return (
		<Portal>
			<Modal contentContainerStyle={[css.modal, {backgroundColor: colors.elevation.level3}]}
				   onDismiss={hide} visible={shows}>
				<Text style={css.title} variant={'titleMedium'}>Server address</Text>

				<TextInput dense
						   label={'address'}
						   mode={'outlined'}
						   onChangeText={setRemote}
						   placeholder={'https://api-musicly.onrender.com'}
						   value={remote}/>

				<View style={css.buttonContainer}>
					<Button onPress={hide}>Back</Button>
					<Button onPress={changeRemote}>Set</Button>
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

export default ServerSetup;
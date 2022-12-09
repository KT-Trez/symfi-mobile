import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Button, Modal, Portal, Text, TextInput, useTheme} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ResourceManager from '../../services/ResourceManager';
import {SafeAreaView, StyleSheet, ToastAndroid, View} from 'react-native';
import Stack from '../../components/Stack';
import {MaterialCommunityIcons} from '@expo/vector-icons';


interface ServerSetUpProps {
	hide: () => void;
	shows: boolean;
}

function ServerSetup({hide, shows}: ServerSetUpProps) {
	const {colors} = useTheme();

	const [isConnected, setIsConnected] = useState<boolean | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const [remote, setRemote] = useState('');

	const changeRemote = async () => {
		if (!remote)
			return;
		const connected = await testConnection();

		await ResourceManager.Net.changeRemote(remote);
		if (!connected)
			ToastAndroid.showWithGravity('No connection: ' + remote, ToastAndroid.LONG, ToastAndroid.BOTTOM);
		hide();
	};

	const getCurrentRemote = useCallback(async () => {
		setRemote(await AsyncStorage.getItem('remote') ?? '');
	}, []);

	const testConnection = async () => {
		setIsLoading(true);
		try {
			const res = await ResourceManager.Net.axios({
				baseURL: remote,
				method: 'get',
				responseType: 'json',
				timeout: 5000,
				url: '/v2/ping'
			});

			setIsConnected(res.data.success ?? false);
			return res.data.success
		} catch (err) {
			console.error(err);
			setIsConnected(false);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getCurrentRemote();
	}, []);

	return (
		<Portal>
			<Modal contentContainerStyle={[css.modal, {backgroundColor: colors.elevation.level3}]}
				   onDismiss={hide} visible={shows}>
				<Text style={css.title} variant={'titleMedium'}>Change server</Text>

				<SafeAreaView>
					<TextInput dense
							   label={'address'}
							   mode={'outlined'}
							   onChangeText={setRemote}
							   placeholder={'https://api-musicly.onrender.com'}
							   value={remote}/>
				</SafeAreaView>

				{isConnected !== null ?
					<Stack alignItems={'center'} direction={'row'} sx={css.status}>
						<MaterialCommunityIcons color={isConnected ? colors.onSurface : colors.error}
												name={isConnected ? 'access-point-network' : 'access-point-network-off'}
												size={14}
												style={css.statusLabel}/>

						<Text style={[css.statusLabel, {color: isConnected ? colors.onSurface : colors.error}]}
							  variant={'labelLarge'}>{isConnected ? 'Connection established' : 'Can\'t connect to server'}</Text>

						{isLoading &&
							<ActivityIndicator size={14} style={css.statusLabel}/>
						}
					</Stack>
					:
					undefined
				}

				<View style={css.buttonContainer}>
					<Button onPress={hide}>Back</Button>
					<Button icon={'access-point'} onPress={testConnection}>Test</Button>
					<Button onPress={changeRemote}>Change</Button>
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
	status: {
		marginTop: 5
	},
	statusLabel: {
		marginLeft: 5
	},
	title: {
		marginBottom: 15
	}
});

export default ServerSetup;
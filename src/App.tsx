import {DarkTheme, NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import React, {useEffect} from 'react';
import {MD3DarkTheme, Provider as PaperProvider} from 'react-native-paper';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import ResourceManager from './services/ResourceManager';
import useSchemaUpdate from './hooks/useSchemaUpdate';


export default function App() {
	useEffect(() => {
		ResourceManager.Net.loadRemote();
		useSchemaUpdate();
	}, []);

	return (
		<NativeBaseProvider>
			<PaperProvider theme={MD3DarkTheme}>
				<NavigationContainer theme={DarkTheme}>
					<BottomTabNavigator/>
				</NavigationContainer>
			</PaperProvider>
		</NativeBaseProvider>
	);
}
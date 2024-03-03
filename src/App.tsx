import {DarkTheme, NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {MD3DarkTheme, Provider as PaperProvider} from 'react-native-paper';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import ResourceManager from './services/ResourceManager';
import useSchemaUpdate from './hooks/useSchemaUpdate';


export default function App() {
	useEffect(() => {
		useSchemaUpdate();
    ResourceManager.Net.loadRemote();
	}, []);

	return (
		<PaperProvider theme={MD3DarkTheme}>
			<NavigationContainer theme={DarkTheme}>
				<BottomTabNavigator/>
			</NavigationContainer>
		</PaperProvider>
	);
}
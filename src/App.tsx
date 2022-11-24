import {DarkTheme, NavigationContainer} from '@react-navigation/native';
import axios from 'axios';
import React from 'react';
import {MD3DarkTheme, Provider as PaperProvider} from 'react-native-paper';
import BottomTabNavigator from './navigation/BottomTabNavigator';

// todo: implement HTTPModule
Object.assign(axios.defaults, {
	baseURL: 'https://musicly-api.herokuapp.com/',
	timeout: 20000
});

export default function App() {
	return (
		<PaperProvider theme={MD3DarkTheme}>
			<NavigationContainer theme={DarkTheme}>
				<BottomTabNavigator/>
			</NavigationContainer>
		</PaperProvider>
	);
}
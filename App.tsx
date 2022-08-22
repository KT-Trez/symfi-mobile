import axios from 'axios';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import BottomTabs from './src/navigation/BottomTabs';


Object.assign(axios.defaults, {
	baseURL: 'https://musicly-api.herokuapp.com/',
	timeout: 20000
})
//axios.defaults.baseURL = 'http://localhost:3000';
//axios.defaults.timeout = 20000;


export default function App() {
	return (
		<NavigationContainer>
			<BottomTabs/>
		</NavigationContainer>
	);
}
import {MaterialIcons} from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import AudioSearch from './bottom-tab-navigator/AudioSearch';
import PlayListStackNavigator from './bottom-tab-navigator/PlayListStackNavigator';
import SongsStackNavigator from './bottom-tab-navigator/SongsStackNavigator';


const {Navigator, Screen} = createBottomTabNavigator();

function BottomTabNavigator() {
	return (
		<Navigator initialRouteName={'playlists'}>
			<Screen component={PlayListStackNavigator}
					name={'playlists'}
					options={{
						headerShown: false,
						tabBarLabel: 'Playlists',
						tabBarIcon: ({color, size}) => (<MaterialIcons color={color} name={'album'} size={size}/>)
					}}/>
			<Screen component={AudioSearch}
					name={'search'}
					options={{
						headerShown: false,
						tabBarLabel: 'Search',
						tabBarIcon: ({color, size}) => (<MaterialIcons color={color} name={'search'} size={size}/>)
					}}/>
			<Screen component={SongsStackNavigator}
					name={'saved-audio'}
					options={{
						headerShown: false,
						tabBarLabel: 'Saved',
						tabBarIcon: ({color, size}) => (<MaterialIcons color={color} name={'save'} size={size}/>)
					}}/>
		</Navigator>
	);
}

export default BottomTabNavigator;
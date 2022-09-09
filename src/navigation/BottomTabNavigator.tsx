import {MaterialIcons} from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import PlayListStackNavigator from './bottom-tab-navigator/PlayListStackNavigator';
import SongsSearch from './bottom-tab-navigator/SongsSearch';
import SongsStackNavigator from './bottom-tab-navigator/SongsStackNavigator';


const {Navigator, Screen} = createBottomTabNavigator();

function BottomTabNavigator() {
	return (
		<Navigator initialRouteName={'playlists'}>
			<Screen component={PlayListStackNavigator}
					name={'playlists'}
					options={{
						headerShown: false,
						tabBarLabel: 'PlayLists',
						tabBarIcon: ({color, size}) => (<MaterialIcons color={color} name={'playlist-play'} size={size}/>)
					}}/>
			<Screen component={SongsSearch}
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
						tabBarLabel: 'SongsList',
						tabBarIcon: ({color, size}) => (<MaterialIcons color={color} name={'audiotrack'} size={size}/>)
					}}/>
		</Navigator>
	);
}

export default BottomTabNavigator;
import {MaterialIcons} from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import PlayListStackNavigator from './bottom-tab-navigator/PlayListStackNavigator';
import Settings from './bottom-tab-navigator/Settings';
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
				        tabBarIcon: ({color, size}) => (<MaterialIcons color={color} name={'playlist-play'} size={size}/>),
				        tabBarLabel: 'PlayLists'
			        }}/>
			<Screen component={SongsSearch}
			        name={'search'}
			        options={{
				        headerShown: false,
				        tabBarIcon: ({color, size}) => (<MaterialIcons color={color} name={'search'} size={size}/>),
				        tabBarLabel: 'Search'
			        }}/>
			<Screen component={SongsStackNavigator}
			        name={'saved-audio'}
			        options={{
				        headerShown: false,
				        tabBarIcon: ({color, size}) => (<MaterialIcons color={color} name={'audiotrack'} size={size}/>),
				        tabBarLabel: 'SongsList'
			        }}/>
			<Screen component={Settings}
			        name={'Settings'}
			        options={{
				        headerShown: false,
				        tabBarIcon: ({color, size}) => (<MaterialIcons color={color} name={'settings'} size={size}/>),
				        tabBarLabel: 'Settings'
			        }}/>
		</Navigator>
	);
}

export default BottomTabNavigator;
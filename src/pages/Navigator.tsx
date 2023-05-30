import {MaterialIcons} from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import PlayListsNavigator from './PlayLists/Navigator';
import SongsSearch from './Search/SongsSearch';
import Settings from './Settings/Settings';
import SongListNavigator from './SongList/Navigator';


const {Navigator, Screen} = createBottomTabNavigator();

function MainNavigator() {
	return (
		<Navigator initialRouteName={'playlists'}>
			<Screen component={PlayListsNavigator}
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
			<Screen component={SongListNavigator}
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

export default MainNavigator;
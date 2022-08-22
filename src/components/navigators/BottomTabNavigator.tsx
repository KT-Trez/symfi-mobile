import {MaterialIcons} from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import SavedAudio from './bottom-tab-navigator/SavedAudio';
import StackNavigator from './bottom-tab-navigator/StackNavigator';
import AudioSearch from './bottom-tab-navigator/AudioSearch';


const {Navigator, Screen} = createBottomTabNavigator();

function BottomTabNavigator() {
	return (
		<Navigator initialRouteName={'playlists'}>
			<Screen component={StackNavigator}
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
			<Screen component={SavedAudio}
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
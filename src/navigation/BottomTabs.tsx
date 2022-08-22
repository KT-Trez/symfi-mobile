import {MaterialIcons} from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import Albums from './screens/Albums';
import Search from './screens/Search';


const {Navigator, Screen} = createBottomTabNavigator();

function BottomTabs() {
	return (
		<Navigator initialRouteName={'albums'}>
			<Screen component={Albums}
					name={'albums'}
					options={{
						tabBarLabel: 'Playlists',
						tabBarIcon: ({color, size}) => (<MaterialIcons color={color} name={'album'} size={size}/>)
					}}/>
			<Screen component={Search}
					name={'search'}
					options={{
						tabBarLabel: 'Search',
						tabBarIcon: ({color, size}) => (<MaterialIcons color={color} name={'search'} size={size}/>)
					}}/>
		</Navigator>
	);
}

export default BottomTabs;
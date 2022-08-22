import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PlaylistsMenu from '../stack-navigator/PlaylistsMenu';
import PlaylistContent from '../stack-navigator/PlaylistContent';


const {Navigator, Screen} = createNativeStackNavigator();

function StackNavigator() {
	const defaultOptions = {
		headerShown: false
	};

	return (
		<Navigator>
			<Screen component={PlaylistsMenu}
					name={'playlists-menu'}
					options={defaultOptions}/>
			<Screen component={PlaylistContent}
					name={'playlist-content'}
					options={defaultOptions}/>
		</Navigator>
	);
}

export default StackNavigator;
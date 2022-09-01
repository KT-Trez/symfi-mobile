import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../../typings/navigation';
import PlaylistEdit from '../stack-navigator/PlaylistEdit';
import PlaylistsMenu from '../stack-navigator/PlaylistsMenu';
import PlaylistContent from '../stack-navigator/PlaylistContent';


const {Navigator, Screen} = createNativeStackNavigator<RootStackParamList>();

function StackNavigator() {
	const defaultOptions = {
		headerShown: false
	};

	return (
		<Navigator>
			<Screen component={PlaylistsMenu}
					name={'PlaylistMenu'}
					options={defaultOptions}/>
			<Screen component={PlaylistContent}
					name={'PlaylistContent'}
					options={defaultOptions}/>
			<Screen component={PlaylistEdit}
					name={'PlaylistEdit'}
					options={defaultOptions}/>
		</Navigator>
	);
}

export default StackNavigator;
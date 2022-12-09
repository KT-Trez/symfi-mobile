import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {RootPlayListsStackParamList} from '../../../typings/navigation';
import ChangeOrder from '../play-list-stack-navigator/ChangeOrder';
import PlaylistContent from '../play-list-stack-navigator/PlaylistContent';
import PlaylistEdit from '../play-list-stack-navigator/PlaylistEdit';
import PlayListsMenu from '../play-list-stack-navigator/PlayListsMenu';
import Settings from '../play-list-stack-navigator/Settings';


const {Navigator, Screen} = createNativeStackNavigator<RootPlayListsStackParamList>();

function PlayListStackNavigator() {
	const defaultOptions = {
		headerShown: false
	};

	return (
		<Navigator initialRouteName={'PlaylistMenu'}>
			<Screen component={PlaylistContent}
					name={'PlaylistContent'}
					options={defaultOptions}/>
			<Screen component={PlaylistEdit}
					name={'PlaylistEdit'}
					options={defaultOptions}/>
			<Screen component={PlayListsMenu}
					name={'PlaylistMenu'}
					options={defaultOptions}/>
			<Screen component={ChangeOrder}
					name={'PlayListOrder'}
					options={defaultOptions}/>
			<Screen component={Settings}
					name={'Settings'}
					options={defaultOptions}/>
		</Navigator>
	);
}

export default PlayListStackNavigator;
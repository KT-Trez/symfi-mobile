import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {RootPlayListsStackParamList} from '../../../types/navigation';
import PlaylistContent from './Content/PlaylistContent';
import PlaylistEdit from './Edit/PlaylistEdit';
import List from './List/List';
import ChangeOrder from './Order/ChangeOrder';


const {Navigator, Screen} = createNativeStackNavigator<RootPlayListsStackParamList>();

function PlayListsNavigator() {
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
			<Screen component={List}
					name={'PlaylistMenu'}
					options={defaultOptions}/>
			<Screen component={ChangeOrder}
					name={'PlayListOrder'}
					options={defaultOptions}/>
		</Navigator>
	);
}

export default PlayListsNavigator;
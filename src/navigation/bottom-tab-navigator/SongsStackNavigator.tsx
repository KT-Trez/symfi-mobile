import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {RootSongsStackParamList} from '../../../typings/navigation';
import SavedAudio from '../songs-stack-navigator/SavedAudio';
import SongEdit from '../songs-stack-navigator/SongEdit';


const {Navigator, Screen} = createNativeStackNavigator<RootSongsStackParamList>();

function SongsStackNavigator() {
	const defaultOptions = {
		headerShown: false
	};

	return (
		<Navigator>
			<Screen component={SavedAudio}
					name={'SongList'}
					options={defaultOptions}/>
			<Screen component={SongEdit}
					name={'SongEdit'}
					options={defaultOptions}/>
		</Navigator>
	);
}

export default SongsStackNavigator;
import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import {SongMetadata} from '../../../typings/interfaces';


interface SongItemProps {
	item: SongMetadata;
}

function SavedAudioItem({item}: SongItemProps) {
	return (
		<View>
			<Text>{item.id}</Text>
		</View>
	);
}

export default SavedAudioItem;
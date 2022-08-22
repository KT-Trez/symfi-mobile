import React from 'react';
import {Text, View} from 'react-native';


interface AlbumProps {
	_id: string;
	cover: {
		name: string;
		uri: string;
	}
	name: string;
	songs: number;
}

function Album({_id}: AlbumProps) {
	return (
		<View>
			<Text>{_id}</Text>
		</View>
	);
}

export default Album;
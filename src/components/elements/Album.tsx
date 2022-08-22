import {NavigationContext} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Avatar, Text} from 'react-native-paper';
import {PlaylistMetadata} from '../../../typings/interfaces';


interface AlbumProps {
	item: PlaylistMetadata;
}

function Album({item}: AlbumProps) {
	const navigation = React.useContext(NavigationContext);

	return (
		<TouchableOpacity onPress={() => navigation?.navigate('playlist-content', {playlistID: item._id})} style={css.container}>
			<View style={css.imageContainer}>
				{item.cover.uri ?
					<Avatar.Image size={50} source={() => item.cover.uri}/>
					:
					<Avatar.Text label={item.cover.name.split('_')[2].slice(0, 1)} size={50}/>
				}
			</View>
			<View style={css.textContainer}>
				<Text variant={'titleMedium'}>{item.name}</Text>
				<Text variant={'labelMedium'}>{item.songs} {item.songs !== 1 ? 'songs' : 'song'}</Text>
			</View>
		</TouchableOpacity>
	);
}

const css = StyleSheet.create({
	container: {
		flexDirection: 'row'
	},
	imageContainer: {
		flex: 1,
		padding: 10
	},
	textContainer: {
		flex: 4,
		padding: 10,
		paddingLeft: 0
	}
});

export default Album;
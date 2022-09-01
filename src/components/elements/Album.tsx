import {NavigationContext} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Avatar, Text} from 'react-native-paper';
import {PlaylistMetadata} from '../../../typings/interfaces';


interface AlbumProps {
	item: PlaylistMetadata;
	loadToRemove: (id: string) => void;
}

function Album({item, loadToRemove}: AlbumProps) {
	const navigation = React.useContext(NavigationContext);

	const remove = () => {
		loadToRemove(item.id);
	};

	return (
		<TouchableOpacity onLongPress={remove} onPress={() => navigation?.navigate('PlaylistContent', {id: item.id})}
						  style={css.container}>
			<View style={css.imageContainer}>
				{item.cover.uri ?
					<Avatar.Image size={50} source={() => item.cover.uri}/>
					:
					<Avatar.Text label={item.cover.name.split('_')[2].slice(0, 1)} size={50}/>
				}
			</View>

			<View style={css.textContainer}>
				<Text variant={'titleMedium'}>{item.name}</Text>
				<Text variant={'labelMedium'}>{item.songsCount} {item.songsCount !== 1 ? 'songs' : 'song'}</Text>
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
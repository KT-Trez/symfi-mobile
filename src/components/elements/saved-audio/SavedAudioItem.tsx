import {MaterialIcons} from '@expo/vector-icons';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {SavedSongMetadata} from '../../../../typings/interfaces';


interface SongItemProps {
	item: SavedSongMetadata;
	loadToAudioPlayer: (id: string) => void;
	removeResource: (id: string) => void;
}

function SavedAudioItem({item, loadToAudioPlayer, removeResource}: SongItemProps) {
	const changeCover = () => {

	};

	const deleteAudio = () => {
		removeResource(item.id);
	};

	const playAudio = () => {
		loadToAudioPlayer(item.id);
	};

	return (
		<View style={css.container}>
			<TouchableOpacity onPress={changeCover} style={css.containerImage}>
				{item.musicly.flags.hasCover ?
					<Image source={{uri: item.musicly.cover.uri}}/>
					:
					<MaterialIcons color={ '#' + item.musicly.cover.color} name='image' size={30}/>
				}
			</TouchableOpacity>
			<TouchableOpacity onPress={playAudio} onLongPress={deleteAudio} style={css.containerText}>
				<View style={css.containerTitle}>
					<Text numberOfLines={1} variant={'titleMedium'}>{item.title}</Text>
					<Text numberOfLines={1} variant={'labelSmall'}>{Math.round(item.musicly.file.size / 1024 / 1024 * 100) / 100}MB • {item.channel.name}</Text>
				</View>
				<View style={css.containerMetadata}>
					<Text variant={'bodySmall'}>{item.metadata.short_view_count_text.simple_text}</Text>
					<Text variant={'bodySmall'}>{item.metadata.duration.simple_text}</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
}

const css = StyleSheet.create({
	container: {
		alignItems: 'center',
		flexDirection: 'row',
		padding: 10
	},
	containerImage: {
		alignItems: 'center',
		flex: 2,
		justifyContent: 'center'
	},
	containerMetadata: {
		alignItems: 'flex-end',
		flex: 1,
		justifyContent: 'flex-end'
	},
	containerText: {
		flex: 6,
		flexDirection: 'row'
	},
	containerTitle: {
		flex: 2
	}
});

export default SavedAudioItem;
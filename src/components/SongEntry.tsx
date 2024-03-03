import {MaterialIcons} from '@expo/vector-icons';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {SavedSongMetadata} from '../../typings/interfaces';
import {Song as SongC} from '../services/ResourceManager';


interface SongEntryProps {
	item: SavedSongMetadata | SongC;
	onLongPress?: () => void;
	onPress?: () => void;
}

function SongEntry({item, onLongPress, onPress}: SongEntryProps) {
	const {colors} = useTheme();

	return (
		<TouchableOpacity onLongPress={onLongPress}
						  onPress={onPress}
						  style={[css.container, {backgroundColor: colors.elevation.level1}]}>
			<View style={css.containerCoverChange}>
				{item.musicly.flags.hasCover ?
					<Image source={{uri: item.musicly.cover.uri}}
						   style={css.image}/>
					:
					<MaterialIcons color={'#' + item.musicly.cover.color} name='image' size={30}/>
				}
			</View>
			<View style={css.containerText}>
				<View style={css.containerTitle}>
					<Text numberOfLines={1} variant={'titleMedium'}>{item.title}</Text>
					<Text numberOfLines={1} variant={'labelSmall'}>
						{Math.round((item.musicly.file.size ?? 0) / 1024 / 1024 * 100) / 100}MB • {item.channel.name}
					</Text>
				</View>
				<View style={css.containerMetadata}>
					<Text variant={'bodySmall'}>{item.metadata.short_view_count_text.simple_text}</Text>
					<Text variant={'bodySmall'}>{item.metadata.duration.simple_text}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const css = StyleSheet.create({
	container: {
		alignItems: 'center',
		flexDirection: 'row',
		margin: 5,
		marginBottom: 2.5,
		marginTop: 2.5
	},
	containerCoverChange: {
		alignItems: 'center',
		flex: 2,
		justifyContent: 'center',
		padding: 5
	},
	containerMetadata: {
		alignItems: 'flex-end',
		flex: 1,
		justifyContent: 'flex-end'
	},
	containerText: {
		flex: 6,
		flexDirection: 'row',
		padding: 10
	},
	containerTitle: {
		flex: 2
	},
	image: {
		aspectRatio: 1.77,
		width: '100%'
	}
});

export default SongEntry;
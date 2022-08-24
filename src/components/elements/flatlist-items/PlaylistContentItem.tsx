import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {SongMetadata} from '../../../../typings/interfaces';


interface PlaylistContentItemProps {
	item: SongMetadata;
	loadResource: (id: string) => void;
}

function PlaylistContentItem({item, loadResource}: PlaylistContentItemProps) {
	const playAudio = () => {
	  loadResource(item.id);
	};

	return (
		<TouchableOpacity onPress={playAudio} style={css.container}>
			<View style={css.titleContainer}>
				<Text numberOfLines={1} variant={'bodyLarge'}>{item.title}</Text>
				<Text numberOfLines={1} variant={'labelSmall'}>{item.channel.name}</Text>
			</View>
			<View style={css.infoContainer}>
				<Text numberOfLines={1} variant={'labelSmall'}>{item.metadata.short_view_count_text.simple_text}</Text>
				<Text numberOfLines={1} variant={'labelSmall'}>{item.metadata.duration.simple_text}</Text>
			</View>
		</TouchableOpacity>
	);
}

const css = StyleSheet.create({
	container: {
		flexDirection: 'row',
		padding: 5
	},
	infoContainer: {
		alignItems: 'flex-end',
		flex: 1,
		justifyContent: 'flex-end'
	},
	titleContainer: {
		flex: 4
	}
});

export default PlaylistContentItem;
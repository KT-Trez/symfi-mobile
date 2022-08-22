import {Audio} from 'expo-av';
import * as FileSystem from 'expo-file-system';
import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {SongMetadata} from '../../../typings/interfaces';


interface PlaylistContentItemProps {
	item: SongMetadata;
}

function PlaylistContentItem({item}: PlaylistContentItemProps) {
	const [player, setPlayer] = useState<Audio.Sound>();

	const playAudio = async () => {
		setPlayer(new Audio.Sound());

		console.log((await FileSystem.getInfoAsync(item.path!)));

		await player?.loadAsync({uri: item.path!}, {shouldPlay: true})

		await player?.playAsync();
	};

	//useEffect(() => {
	//	return player ? () => player!.unloadAsync() : undefined;
	//}, [player]);

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
import React, {useRef} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {PlaylistData, SavedSongMetadata} from '../../../../typings/interfaces';
import {PlaylistDatabase, SongsDatabase} from '../../../schemas/schemas';


interface PlaylistContentItemProps {
	item: SavedSongMetadata;
	loadResource: (id: string) => void;
	playlistID: string;
	refreshPlaylist: () => void;
}

function PlaylistContentItem({item, loadResource, playlistID, refreshPlaylist}: PlaylistContentItemProps) {
	const playlistDB = useRef(PlaylistDatabase.getInstance());
	const songsDB = useRef(SongsDatabase.getInstance());

	const playAudio = () => {
		loadResource(item.id);
	};

	const removeFromPlayList = async () => {
		const playlistItem = (await songsDB.current.findOne({id: item.id})).musicly.playlists.find((p: PlaylistData) => p.id === playlistID);
		await songsDB.current.update({id: item.id}, {$pull: {'musicly.playlists': playlistItem}}, {});
		await playlistDB.current.update({id: playlistID}, {$inc: {songsCount: -1}}, {});

		refreshPlaylist();
	};

	return (
		<TouchableOpacity onLongPress={removeFromPlayList} onPress={playAudio} style={css.container}>
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
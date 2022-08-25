import {useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Appbar, Divider, Text} from 'react-native-paper';
import {SavedSongMetadata} from '../../../../typings/interfaces';
import {SongsDatabase} from '../../../schemas/schemas';
import AddSongModal from '../../elements/AddSongModal';
import AudioPlayer from '../../elements/AudioPlayer';
import PlaylistContentItem from '../../elements/flatlist-items/PlaylistContentItem';


function PlaylistContent() {
	const route = useRoute();
	//@ts-ignore
	const playlistID = route.params?.playlistID;

	const [allSongs, setAllSongs] = useState<{ id: string, name: string }[]>([]);
	const [songs, setSongs] = useState<SavedSongMetadata[]>([]);

	const [currentSongID, setCurrentSongID] = useState<string | undefined>();
	const [songAddVisible, setSongAddVisible] = useState(false);

	const getPlaylist = useCallback(async () => {
		const db = SongsDatabase.getInstance();
		setSongs(await db.find<SavedSongMetadata[]>({'musicly.playlists.id': playlistID}));
	}, []);

	const getSongs = useCallback(async () => {
		const db = SongsDatabase.getInstance();
		setAllSongs((await db.find<SavedSongMetadata[]>({$not: {'musicly.playlists.id': playlistID}})).map(song => {
			return {id: song.id, name: song.title}
		}));
	}, []);

	const hideSongAddMenu = () => {
		setSongAddVisible(false);
	};

	const showSongAddMenu = async () => {
		await getSongs();
		setSongAddVisible(true);
	};

	useEffect(() => {
		getPlaylist();
	}, []);

	return (
		<View>
			<Appbar.Header elevated mode={'small'}>
				<Appbar.Content title={playlistID}/>
				<Appbar.Action icon={'plus'} onPress={showSongAddMenu}/>
			</Appbar.Header>

			<AudioPlayer audioID={currentSongID} setAudioID={setCurrentSongID} songs={songs}/>

			<FlatList data={songs}
					  ItemSeparatorComponent={Divider}
					  ListEmptyComponent={<Text style={css.textError}>This playlist is empty.</Text>}
					  renderItem={({item}) => <PlaylistContentItem item={item} loadResource={setCurrentSongID} playlistID={playlistID} refreshPlaylist={getPlaylist}/>}/>

			<AddSongModal hideModal={hideSongAddMenu}
						  isVisible={songAddVisible}
						  playlistID={playlistID}
						  refreshPlaylist={getPlaylist}
						  selectOptions={allSongs}
						  showModal={showSongAddMenu}/>
		</View>

	);
}

const css = StyleSheet.create({
	textError: {
		margin: 15,
		textAlign: 'center'
	}
});

export default PlaylistContent;
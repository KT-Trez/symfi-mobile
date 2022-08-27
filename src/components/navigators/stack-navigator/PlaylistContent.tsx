import {useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
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
	const songsDB = useRef(SongsDatabase.getInstance());

	const [songs, setSongs] = useState<SavedSongMetadata[]>([]);

	const [currentSongID, setCurrentSongID] = useState<string | undefined>();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const getSongs = useCallback(async () => {
		setSongs(await songsDB.current.find<SavedSongMetadata[]>({'musicly.playlists.id': playlistID}));
	}, []);

	const hideModal = () => setIsModalOpen(false);

	const showModal = async () => setIsModalOpen(true);

	useEffect(() => {
		getSongs();
	}, []);

	return (
		<View style={css.container}>
			<Appbar.Header elevated mode={'small'}>
				<Appbar.Content title={songs.length + (songs.length !== 1 ? ' songs' : ' song')}/>
				<Appbar.Action icon={'plus'} onPress={showModal}/>
			</Appbar.Header>

			<AudioPlayer audioID={currentSongID} setAudioID={setCurrentSongID} songs={songs}/>

			<AddSongModal hideModal={hideModal}
						  isVisible={isModalOpen}
						  playlistID={playlistID}
						  refreshPlaylist={getSongs}/>

			<FlatList data={songs}
					  ItemSeparatorComponent={Divider}
					  ListEmptyComponent={<Text style={css.textError}>This playlist is empty.</Text>}
					  renderItem={({item}) => <PlaylistContentItem item={item} loadResource={setCurrentSongID} playlistID={playlistID} refreshPlaylist={getSongs}/>}/>
		</View>

	);
}

const css = StyleSheet.create({
	container: {
		flex: 1
	},
	textError: {
		margin: 15,
		textAlign: 'center'
	}
});

export default PlaylistContent;
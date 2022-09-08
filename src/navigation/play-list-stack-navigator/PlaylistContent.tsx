import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Appbar, Divider, Text, useTheme} from 'react-native-paper';
import {SavedSongMetadata} from '../../../typings/interfaces';
import {RootPlayListsStackParamList} from '../../../typings/navigation';
import AudioPlayer from '../../components/elements/AudioPlayer';
import PlaylistContentItem from '../../components/elements/flatlist-items/PlaylistContentItem';
import {SongsDatabase} from '../../schemas/schemas';
import SongsManager from '../../screens/play-list-content/SongsManager';


type ProfileScreenRouteProp = RouteProp<RootPlayListsStackParamList, 'PlaylistContent'>;

function PlaylistContent() {
	const {colors} = useTheme();
	const route = useRoute<ProfileScreenRouteProp>();
	const playlistID = route.params?.id;
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
		<View style={[css.container, {backgroundColor: colors.background}]}>
			<Appbar.Header elevated mode={'small'}>
				<Appbar.Content title={songs.length + (songs.length !== 1 ? ' songs' : ' song')}/>
				<Appbar.Action icon={'plus'} onPress={showModal}/>
			</Appbar.Header>

			<AudioPlayer audioID={currentSongID} setAudioID={setCurrentSongID} songs={songs}/>

			<SongsManager hideModal={hideModal}
						  isVisible={isModalOpen}
						  playlistID={playlistID}
						  refreshPlaylist={getSongs}/>

			<FlatList data={songs}
					  ItemSeparatorComponent={Divider}
					  ListEmptyComponent={<Text style={css.textError}>This playlist is empty.</Text>}
					  renderItem={({item}) => <PlaylistContentItem item={item} loadResource={setCurrentSongID}
																   playlistID={playlistID}
																   refreshPlaylist={getSongs}/>}/>
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
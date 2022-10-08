import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Appbar, Text, useTheme} from 'react-native-paper';
import {SavedSongMetadata} from '../../../typings/interfaces';
import {RootPlayListsStackParamList} from '../../../typings/navigation';
import AudioPlayer from '../../components/AudioPlayer';
import SongsController from '../../datastore/SongsController';
import Song from '../../screens/play-list-content/Song';
import SongsManager from '../../screens/play-list-content/SongsManager';


type ProfileScreenRouteProp = RouteProp<RootPlayListsStackParamList, 'PlaylistContent'>;

function PlaylistContent() {
	const {colors} = useTheme();
	const route = useRoute<ProfileScreenRouteProp>();
	const playlistID = route.params?.id;
	const songsDB = useRef(new SongsController());

	const [songs, setSongs] = useState<SavedSongMetadata[]>([]);

	const [currentSongID, setCurrentSongID] = useState<string | undefined>();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const getSongs = useCallback(async () => {
		setSongs(await songsDB.current.db.findAsync({'musicly.playlists.id': playlistID}) as SavedSongMetadata[]);
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
					  ListEmptyComponent={<Text style={css.textError} variant={'bodyMedium'}>This playlist is empty.</Text>}
					  renderItem={({item}) => <Song item={item}
													loadToPlay={setCurrentSongID}
													playlistID={playlistID}
													refreshPlaylist={getSongs}/>}
					  style={css.flatList}/>
		</View>

	);
}

const css = StyleSheet.create({
	container: {
		flex: 1
	},
	flatList: {
		paddingBottom: 2.5,
		paddingTop: 2.5
	},
	textError: {
		margin: 15,
		textAlign: 'center'
	}
});

export default PlaylistContent;
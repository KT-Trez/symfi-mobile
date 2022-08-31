import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Appbar} from 'react-native-paper';
import {SavedSongMetadata} from '../../../../typings/interfaces';
import {SongsDatabase} from '../../../schemas/schemas';
import AudioPlayer from '../../elements/AudioPlayer';
import DeleteDialog from '../../elements/saved-audio/DeleteDialog';
import SavedAudioItem from '../../elements/saved-audio/SavedAudioItem';
import SearchSavedAudio from '../../elements/saved-audio/SearchSavedAudio';


function SavedAudio() {
	const songsDB = useRef(SongsDatabase.getInstance());

	const [deleteSongID, setDeleteSongID] = useState<string | undefined>();
	const [playingSongID, setPlayingSongID] = useState<string | undefined>();

	const [isRefreshing, setIsRefreshing] = useState(false);

	const [songs, setSongs] = useState<SavedSongMetadata[]>([]);

	const getSongs = useCallback(async () => {
		setIsRefreshing(true);
		setSongs(await songsDB.current.find<SavedSongMetadata[]>({}));
		setIsRefreshing(false);
	}, []);

	useEffect(() => {
		getSongs();
	}, []);

	return (
		<View style={css.container}>
			<Appbar.Header elevated mode={'small'}>
				<Appbar.Content title={'Hold to delete'}/>
			</Appbar.Header>

			<AudioPlayer audioID={playingSongID} setAudioID={setPlayingSongID} songs={songs}/>

			<DeleteDialog deleteSongID={deleteSongID}
						  playSongID={playingSongID}
						  refreshSongsList={getSongs}
						  setDeleteSongID={setDeleteSongID}
						  songs={songs}/>

			<SearchSavedAudio data={songs}
							  isRefreshing={isRefreshing}
							  keyExtractor={(item) => item.id}
							  refreshData={getSongs}
							  renderItem={({item}) => <SavedAudioItem item={item}
																	  loadToAudioPlayer={setPlayingSongID}
																	  loadToRemove={setDeleteSongID}/>}
							  searchbarText={'Search for saved song'}
							  searchEmptyText={'You have no saved songs yet.'}/>
		</View>
	);
}

const css = StyleSheet.create({
	container: {
		flex: 1
	},
	searchbar: {
		margin: 5
	},
	textError: {
		margin: 5,
		textAlign: 'center'
	}
});

export default SavedAudio;
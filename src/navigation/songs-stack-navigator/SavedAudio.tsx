import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Appbar, useTheme} from 'react-native-paper';
import {SavedSongMetadata} from '../../../typings/interfaces';
import AudioPlayer from '../../components/elements/AudioPlayer';
import EditDialog from '../../components/elements/saved-audio/EditDialog';
import SavedAudioItem from '../../components/elements/saved-audio/SavedAudioItem';
import SearchSavedAudio from '../../components/elements/saved-audio/SearchSavedAudio';
import {SongsDatabase} from '../../schemas/schemas';


function SavedAudio() {
	const {colors} = useTheme();
	const songsDB = useRef(SongsDatabase.getInstance());

	const [songToManageID, setSongToManageID] = useState<string | undefined>();
	const [songToPlayID, setSongToPlayID] = useState<string | undefined>();

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
		<View style={[css.container, {backgroundColor: colors.background}]}>
			<Appbar.Header elevated mode={'small'}>
				<Appbar.Content title={'Hold to delete'}/>
			</Appbar.Header>

			<AudioPlayer audioID={songToPlayID} setAudioID={setSongToPlayID} songs={songs}/>

			<EditDialog playingSongID={songToPlayID}
						refreshSongsList={getSongs}
						setSongID={setSongToManageID}
						songID={songToManageID}
						songs={songs}/>

			<SearchSavedAudio data={songs}
							  isRefreshing={isRefreshing}
							  keyExtractor={(item) => item.id}
							  refreshData={getSongs}
							  renderItem={({item}) => <SavedAudioItem item={item}
																	  loadToManage={setSongToManageID}
																	  loadToPlay={setSongToPlayID}/>}
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
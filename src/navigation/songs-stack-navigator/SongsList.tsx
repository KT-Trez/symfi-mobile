import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Appbar, useTheme} from 'react-native-paper';
import AudioPlayer from '../../components/AudioPlayer';
import Song from '../../components/Song';
import useSongs from '../../hooks/useSongs';
import EditDialog from '../../views/songs-list/EditDialog';
import Search from '../../views/songs-list/Search';


function SongsList() {
	const {colors} = useTheme();

	const [songToManageID, setSongToManageID] = useState<string | undefined>();
	const [songToPlayID, setSongToPlayID] = useState<string | undefined>();

	const [isLoading, songs, refreshSongs] = useSongs();
	//  todo: implement sorting
	// const [sort, setSort] = useState<{ ascending: boolean, type: 'author' | 'date' | 'duration' | 'title' } | null>(null);

	return (
		<View style={[css.container, {backgroundColor: colors.background}]}>
			<Appbar.Header elevated mode={'small'}>
				<Appbar.Content title={songs.length + (songs.length !== 1 ? ' songs' : ' song')}/>
			</Appbar.Header>

			<AudioPlayer audioID={songToPlayID} setAudioID={setSongToPlayID} songs={songs}/>

			<EditDialog playingSongID={songToPlayID}
			            refreshSongsList={refreshSongs}
			            setSongID={setSongToManageID}
			            songID={songToManageID}/>

			<Search data={songs}
			        isRefreshing={isLoading}
			        keyExtractor={(item) => item.id}
			        refreshData={refreshSongs}
			        renderItem={({item}) => <Song bottomLabel={`${Math.round((item.musicly.file.size ?? 0) / 1024 / 1024 * 100) / 100}MB`}
			                                      data={item}
			                                      onLongPressSelect={setSongToManageID}
			                                      onPressSelect={setSongToPlayID}/>}
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
	flatListText: {
		margin: 5,
		textAlign: 'center'
	}
});

export default SongsList;
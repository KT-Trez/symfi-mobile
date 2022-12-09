import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Appbar, useTheme} from 'react-native-paper';
import AudioPlayer from '../../components/AudioPlayer';
import EditDialog from '../../views/songs-list/EditDialog';
import Search from '../../views/songs-list/Search';
import Song from '../../views/songs-list/Song';
import useSongs from '../../hooks/useSongs';


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
					renderItem={({item}) => <Song item={item}
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
	flatListText: {
		margin: 5,
		textAlign: 'center'
	}
});

export default SongsList;
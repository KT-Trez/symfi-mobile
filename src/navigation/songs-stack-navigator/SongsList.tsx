import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Appbar, useTheme} from 'react-native-paper';
import {SavedSongMetadata} from '../../../typings/interfaces';
import AudioPlayer from '../../components/AudioPlayer';
import SongsController from '../../datastore/SongsController';
import EditDialog from '../../views/songs-list/EditDialog';
import Search from '../../views/songs-list/Search';
import Song from '../../views/songs-list/Song';
import useCompare from '../../hooks/useCompare';


function SongsList() {
	const {colors} = useTheme();
	const songsDB = useRef(new SongsController());

	const [songToManageID, setSongToManageID] = useState<string | undefined>();
	const [songToPlayID, setSongToPlayID] = useState<string | undefined>();

	const [isRefreshing, setIsRefreshing] = useState(false);

	const [songs, setSongs] = useState<SavedSongMetadata[]>([]);
	//  todo: implement filters
	// const [sort, setSort] = useState<{ ascending: boolean, type: 'author' | 'date' | 'duration' | 'title' } | null>(null);

	const getSongs = useCallback(async () => {
		setIsRefreshing(true);
		setSongs(useCompare<SavedSongMetadata>(await songsDB.current.db.findAsync({}) as SavedSongMetadata[], (item) => item.title));
		setIsRefreshing(false);
	}, []);

	useEffect(() => {
		getSongs();
	}, []);

	return (
		<View style={[css.container, {backgroundColor: colors.background}]}>
			<Appbar.Header elevated mode={'small'}>
				<Appbar.Content title={songs.length + ' Songs'}/>
			</Appbar.Header>

			<AudioPlayer audioID={songToPlayID} setAudioID={setSongToPlayID} songs={songs}/>

			<EditDialog playingSongID={songToPlayID}
						refreshSongsList={getSongs}
						setSongID={setSongToManageID}
						songID={songToManageID}/>

			<Search data={songs}
					isRefreshing={isRefreshing}
					keyExtractor={(item) => item.id}
					refreshData={getSongs}
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
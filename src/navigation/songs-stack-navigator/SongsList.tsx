import {NavigationContext} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Appbar, useTheme} from 'react-native-paper';
import {SavedSongMetadata} from '../../../typings/interfaces';
import AudioPlayer from '../../components/AudioPlayer';
import SongsController from '../../datastore/SongsController';
import EditDialog from '../../screens/songs-list/EditDialog';
import Search from '../../screens/songs-list/Search';
import Song from '../../screens/songs-list/Song';


function SongsList() {
	const {colors} = useTheme();
	const navigation = React.useContext(NavigationContext);
	const songsDB = useRef(new SongsController());

	const [songToManageID, setSongToManageID] = useState<string | undefined>();
	const [songToPlayID, setSongToPlayID] = useState<string | undefined>();

	const [isRefreshing, setIsRefreshing] = useState(false);

	const [songs, setSongs] = useState<SavedSongMetadata[]>([]);

	const getSongs = useCallback(async () => {
		setIsRefreshing(true);
		setSongs(await songsDB.current.db.findAsync({}) as SavedSongMetadata[]);
		setIsRefreshing(false);
	}, []);

	useEffect(() => {
		getSongs();
	}, []);

	return (
		<View style={[css.container, {backgroundColor: colors.background}]}>
			<Appbar.Header elevated mode={'small'}>
				<Appbar.Content title={songs.length + ' Songs'}/>
				<Appbar.Action icon={'cloud-sync-outline'} onPress={() => navigation?.navigate('Sync')}/>
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
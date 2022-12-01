import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {MongoDocument} from 'react-native-local-mongodb';
import {Appbar, Menu, Text, useTheme} from 'react-native-paper';
import {PlaylistData, SavedSongMetadata} from '../../../typings/interfaces';
import {RootPlayListsStackParamList} from '../../../typings/navigation';
import AudioPlayer from '../../components/AudioPlayer';
import SongsController from '../../datastore/SongsController';
import Song from '../../views/play-list-content/Song';
import SongsManager from '../../views/play-list-content/SongsManager';
import RemoveFromPlayListDialog from '../../views/play-list-content/RemoveFromPlayListDialog';
import useCompare from '../../hooks/useCompare';
import useVisibility from '../../hooks/useVisibility';


type ProfileScreenRouteProp = RouteProp<RootPlayListsStackParamList, 'PlaylistContent'>;

function PlaylistContent() {
	const {colors} = useTheme();
	const route = useRoute<ProfileScreenRouteProp>();
	const playlistID = route.params?.id;
	const songsDB = useRef(new SongsController());

	const [songs, setSongs] = useState<SavedSongMetadata[]>([]);

	const [currentSongID, setCurrentSongID] = useState<string | undefined>();
	const [removeSong, setRemoveSong] = useState<SavedSongMetadata | null>(null);

	const [hideDialog, dialogShows, showDialog] = useVisibility([() => setRemoveSong(null)]);
	const [hideMenu, menuShows, showMenu] = useVisibility();
	const [hideSongsManager, songsManagerShows, showSongsManager] = useVisibility(undefined, [() => hideMenu()]);
	const [hideSort, sortShows, showSort] = useVisibility();

	const getSongs = useCallback(async () => {
		const compareFun = (a: MongoDocument, b: MongoDocument) => {
			const playListDataA = a.musicly.playlists.find((p: PlaylistData) => p.id === playlistID);
			const playListDataB = b.musicly.playlists.find((p: PlaylistData) => p.id === playlistID);
			return playListDataA.order - playListDataB.order;
		};
		const songsArr = await songsDB.current.db.findAsync({'musicly.playlists.id': playlistID});

		setSongs(songsArr.sort(compareFun) as SavedSongMetadata[]);
	}, []);

	// sorting songs
	const sortByTitleAscending = () => {
		setSongs(arr => useCompare(arr, item => item.title));
		hideSort();
	};
	const sortByTitleDescending = () => {
		setSongs(arr => useCompare(arr, item => item.title, true));
		hideSort();
	};

	const sortByDownloadDateAscending = () => {
		setSongs(arr => useCompare(arr, item => item.musicly.file.downloadDate));
		hideSort();
	};
	const sortByDownloadDateDescending = () => {
		setSongs(arr => useCompare(arr, item => item.musicly.file.downloadDate, true));
		hideSort();
	};

	useEffect(() => {
		getSongs();
	}, []);

	useEffect(() => {
		if (removeSong)
			showDialog();
	}, [removeSong]);

	return (
		<View style={[css.container, {backgroundColor: colors.background}]}>
			<Appbar.Header elevated mode={'small'}>
				<Appbar.Content title={songs.length + (songs.length !== 1 ? ' songs' : ' song')}/>

				<Menu anchor={<Appbar.Action icon={'sort'} onPress={showSort}/>}
					  anchorPosition={'bottom'}
					  onDismiss={hideSort}
					  visible={sortShows}>
					<Menu.Item leadingIcon={'sort-calendar-ascending'}
							   onPress={sortByDownloadDateAscending}
							   title={'Asc by date'}/>
					<Menu.Item leadingIcon={'sort-calendar-descending'}
							   onPress={sortByDownloadDateDescending}
							   title={'Dsc by date'}/>
					<Menu.Item leadingIcon={'sort-alphabetical-ascending'}
							   onPress={sortByTitleAscending}
							   title={'Asc by title'}/>
					<Menu.Item leadingIcon={'sort-alphabetical-descending'}
							   onPress={sortByTitleDescending}
							   title={'Dsc by title'}/>
				</Menu>

				<Menu anchor={<Appbar.Action icon={'dots-vertical'} onPress={showMenu}/>}
					  anchorPosition={'bottom'}
					  onDismiss={hideMenu}
					  visible={menuShows}>
					<Menu.Item leadingIcon={'playlist-plus'} onPress={showSongsManager} title={'Add song'}/>
				</Menu>
			</Appbar.Header>

			<AudioPlayer audioID={currentSongID} setAudioID={setCurrentSongID} songs={songs}/>

			<RemoveFromPlayListDialog hide={hideDialog}
									  playListID={route.params.id}
									  refreshSongList={getSongs}
									  shows={dialogShows}
									  song={removeSong}/>

			<SongsManager hide={hideSongsManager}
						  playlistID={playlistID}
						  refreshPlayList={getSongs}
						  shows={songsManagerShows}/>

			<FlatList data={songs}
					  ListEmptyComponent={
						  <Text style={css.flatListText} variant={'bodyMedium'}>This playlist is empty.</Text>}
					  renderItem={({item}) => <Song item={item}
													loadToPlay={setCurrentSongID}
													loadToRemove={setRemoveSong}/>}
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
	flatListText: {
		margin: 15,
		textAlign: 'center'
	}
});

export default PlaylistContent;
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import {Divider, Modal, Portal, Searchbar, Text, useTheme} from 'react-native-paper';
import {SavedSongMetadata} from '../../../typings/interfaces';
import PlayListController from '../../datastore/PlayListController';
import SongsController from '../../datastore/SongsController';


interface SongsManagerProps {
	hideModal: () => void;
	isVisible: boolean;
	playlistID: string;
	refreshPlaylist: () => void;
}

function SongsManager({hideModal, isVisible, playlistID, refreshPlaylist}: SongsManagerProps) {
	const {colors} = useTheme();
	const playlistsDB = useRef(new PlayListController());
	const songsDB = useRef(new SongsController());

	const [isBlocked, setIsBlocked] = useState(false);

	const [searchQuery, setSearchQuery] = useState('');
	const [searchedSongs, setSearchedSongs] = useState<SavedSongMetadata[]>([]);

	const [songs, setSongs] = useState<SavedSongMetadata[]>([]);

	const getSongs = useCallback(async () => {
		const songsArr = await songsDB.current.db.findAsync({$not: {'musicly.playlists.id': playlistID}}) as SavedSongMetadata[];
		setSongs(songsArr);
		if (songsArr.length !== searchedSongs.length)
			setSearchedSongs([...songsArr]);
	}, []);

	const addToPlaylist = async (itemID: string) => {
		if (isBlocked)
			return;
		setIsBlocked(true);

		await playlistsDB.current.db.updateAsync({id: playlistID}, {$inc: {songsCount: 1}}, {});
		await songsDB.current.db.updateAsync({id: itemID}, {
			$push: {
				'musicly.playlists': {
					id: playlistID,
					isFavourite: false,
					order: (await playlistsDB.current.db.findOneAsync({id: playlistID})).songsCount
				}
			}
		}, {});

		setSearchedSongs(arr => arr.filter(song => song.id !== itemID));
		await getSongs();

		refreshPlaylist();
		setIsBlocked(false);
	};

	useEffect(() => {
		setSearchedSongs([...songs.filter(song => song.title.toLowerCase().match(searchQuery) || song.channel.name.toLowerCase().match(searchQuery))]);
	}, [searchQuery]);

	useEffect(() => {
		if (isVisible)
			getSongs();
	}, [isVisible]);

	return (
		<Portal>
			<Modal contentContainerStyle={[css.modal, {backgroundColor: colors.elevation.level3}]}
				   onDismiss={hideModal}
				   visible={isVisible}>
				<Text variant={'titleMedium'}>Add song to playlist</Text>

				<SafeAreaView>
					<Searchbar elevation={0}
							   onChangeText={setSearchQuery}
							   placeholder={'Search for songs'}
							   style={css.searchbar}
							   value={searchQuery}/>
				</SafeAreaView>

				<FlatList data={searchedSongs}
						  ItemSeparatorComponent={Divider}
						  ListEmptyComponent={<Text style={css.textError} variant={'bodyMedium'}>No search results.</Text>}
						  keyExtractor={item => item.id}
						  renderItem={({item}) => {
							  return (
								  <TouchableOpacity onPress={() => addToPlaylist(item.id)} style={css.searchItem}>
									  <Text numberOfLines={1}>{item.title}</Text>
								  </TouchableOpacity>
							  )
						  }}/>
			</Modal>
		</Portal>
	);
}

const css = StyleSheet.create({
	modal: {
		backgroundColor: 'white',
		margin: 10,
		padding: 20
	},
	searchbar: {
		marginTop: 15
	},
	searchItem: {
		padding: 10
	},
	textError: {
		margin: 15,
		textAlign: 'center'
	}
});

export default SongsManager;
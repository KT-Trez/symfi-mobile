import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import {Divider, Modal, Portal, Searchbar, Text} from 'react-native-paper';
import {SavedSongMetadata} from '../../../typings/interfaces';
import {PlaylistDatabase, SongsDatabase} from '../../schemas/schemas';


interface AddSongModalProps {
	hideModal: () => void;
	isVisible: boolean;
	playlistID: string;
	refreshPlaylist: () => void;
}

function AddSongModal({hideModal, isVisible, playlistID, refreshPlaylist}: AddSongModalProps) {
	const playlistsDB = useRef(PlaylistDatabase.getInstance());
	const songsDB = useRef(SongsDatabase.getInstance());

	const [isBlocked, setIsBlocked] = useState(false);

	const [searchQuery, setSearchQuery] = useState('');
	const [searchedSongs, setSearchedSongs] = useState<SavedSongMetadata[]>([]);

	const [songs, setSongs] = useState<SavedSongMetadata[]>([]);

	const getSongs = useCallback(async () => {
		const songsArr = await songsDB.current.find<SavedSongMetadata[]>({$not: {'musicly.playlists.id': playlistID}});
		setSongs(songsArr);
		if (songsArr.length !== searchedSongs.length)
			setSearchedSongs([...songsArr]);
	}, []);

	const addToPlaylist = async (itemID: string) => {
		if (isBlocked)
			return;
		setIsBlocked(true);

		await songsDB.current.update({id: itemID}, {
			$push: {
				'musicly.playlists': {
					id: playlistID,
					isFavourite: false,
					order: (await playlistsDB.current.findOne({id: playlistID})).songsCount + 1
				}
			}
		}, {});
		await playlistsDB.current.update({id: playlistID}, {$inc: {songsCount: 1}}, {});

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
			<Modal contentContainerStyle={css.modalContainer} onDismiss={hideModal} visible={isVisible}>

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
						  ListEmptyComponent={<Text style={css.textError}>No search results.</Text>}
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
	modalContainer: {
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

export default AddSongModal;
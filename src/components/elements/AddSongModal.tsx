import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import {Divider, Modal, Portal, Searchbar, Text} from 'react-native-paper';
import {PlaylistDatabase, SongsDatabase} from '../../schemas/schemas';


interface AddSongModalProps {
	hideModal: () => void;
	isVisible: boolean;
	playlistID: string;
	refreshPlaylist?: () => void;
	selectOptions: { id: string, name: string }[];
	showModal: () => void;
}

function AddSongModal({hideModal, isVisible, playlistID, refreshPlaylist, selectOptions}: AddSongModalProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [searchedSongs, setSearchedSongs] = useState<{ id: string, name: string }[]>([]);

	const addToPlaylist = async (itemID: string) => {
		const songsDB = new SongsDatabase().init();
		await songsDB.update({id: itemID}, {$push: {playlistsIDs: playlistID}}, {});

		const playlistDB = new PlaylistDatabase().init();
		await playlistDB.update({_id: playlistID}, {$inc: {songs: 1}}, {});

		if (refreshPlaylist)
			refreshPlaylist();
		hideModal();
	};

	useEffect(() => {
		setSearchedSongs([...selectOptions.filter(option => option.name.toLowerCase().match(searchQuery))])
	}, [searchQuery]);

	useEffect(() => {
		setSearchedSongs(selectOptions);
	}, [selectOptions]);

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
									  <Text numberOfLines={1}>{item.name}</Text>
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
		//marginBottom: 10,
		//marginTop: 10
	},
	textError: {
		margin: 15,
		textAlign: 'center'
	}
});

export default AddSongModal;
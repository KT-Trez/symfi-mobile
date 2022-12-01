import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import {Modal, Portal, Searchbar, Text, useTheme} from 'react-native-paper';
import {SavedSongMetadata} from '../../../typings/interfaces';
import Stack from '../../components/Stack';
import SongsController from '../../datastore/SongsController';
import useCompare from '../../hooks/useCompare';


interface SongsManagerProps {
	hide: () => void;
	playListID: string;
	refreshPlayList: () => void;
	shows: boolean;
}

function SongsManager({hide, playListID, refreshPlayList, shows}: SongsManagerProps) {
	const {colors} = useTheme();

	const [isBlocked, setIsBlocked] = useState(false);

	const [searchQuery, setSearchQuery] = useState('');
	const [searchedSongs, setSearchedSongs] = useState<SavedSongMetadata[]>([]);

	const [songs, setSongs] = useState<SavedSongMetadata[]>([]);

	const getSongs = useCallback(async () => {
		setSongs(useCompare(await SongsController.store.findAsync({$not: {'musicly.playListsIDs': playListID}}) as SavedSongMetadata[], item => item.musicly.file.downloadDate));
	}, []);

	useEffect(() => {
		if (songs.length !== searchedSongs.length)
			setSearchedSongs([...songs]);
	}, [songs]);

	const addToPlaylist = async (itemID: string) => {
		if (isBlocked)
			return;
		setIsBlocked(true);

		await SongsController.addToPlayList(itemID, playListID);

		setSearchedSongs(arr => arr.filter(song => song.id !== itemID));

		refreshPlayList();
		setIsBlocked(false);
	};

	useEffect(() => {
		setSearchedSongs([...songs.filter(song => song.title.toLowerCase().match(searchQuery.toLowerCase()) || song.channel.name.toLowerCase().match(searchQuery.toLowerCase()))]);
	}, [searchQuery]);

	useEffect(() => {
		if (shows) {
			getSongs();
			setSearchQuery('');
		}
	}, [shows]);

	return (
		<Portal>
			<Modal contentContainerStyle={[css.modal, {backgroundColor: colors.elevation.level3}]}
				   onDismiss={hide}
				   visible={shows}>
				<Text variant={'titleMedium'}>Add song to playlist</Text>

				<SafeAreaView>
					<Searchbar onChangeText={setSearchQuery}
							   placeholder={'Search for songs'}
							   style={css.searchbar}
							   value={searchQuery}/>
				</SafeAreaView>

				<FlatList data={searchedSongs}
						  ListEmptyComponent={
							  <Text style={css.flatListText} variant={'bodyMedium'}>No search results.</Text>
						  }
						  keyExtractor={item => item.id}
						  renderItem={({item}) => {
							  return (
								  <TouchableOpacity onPress={() => addToPlaylist(item.id)}
													style={[css.searchItem, {backgroundColor: colors.elevation.level2}]}>
									  <Text style={{textAlign: 'right'}} variant={'labelSmall'}>
										  {moment(item.musicly.file.downloadDate).format('HH:mm:ss • DD/MM/YYYY')}
									  </Text>
									  <Stack direction={'column'} sx={{marginTop: 5}}>
										  <Text numberOfLines={2} variant={'titleSmall'}>{item.title}</Text>
										  <Stack direction={'row'} justifyContent={'space-between'}>
											  <Text numberOfLines={1} variant={'bodySmall'}>{item.channel.name}</Text>
											  <Text variant={'bodySmall'}>{item.metadata.duration.simple_text}</Text>
										  </Stack>
									  </Stack>
								  </TouchableOpacity>
							  );
						  }}/>
			</Modal>
		</Portal>
	);
}

const css = StyleSheet.create({
	modal: {
		maxHeight: '90%',
		maxWidth: '90%',
		marginLeft: '5%',
		marginRight: '5%',
		padding: 20
	},
	searchbar: {
		marginBottom: 5,
		marginTop: 15
	},
	searchItem: {
		marginBottom: 5,
		marginTop: 5,
		padding: 10
	},
	flatListText: {
		margin: 15,
		textAlign: 'center'
	}
});

export default SongsManager;
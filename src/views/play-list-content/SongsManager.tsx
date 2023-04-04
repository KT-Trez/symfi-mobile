import moment from 'moment';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import {Modal, Portal, Searchbar, Text, useTheme} from 'react-native-paper';
import {SavedSongMetadata} from '../../../typings/interfaces';
import Stack from '../../components/Stack';
import PlayListController from '../../datastore/PlayListController';
import SongsController from '../../datastore/SongsController';
import useCompare from '../../hooks/useCompare';


interface SongsManagerProps {
	hide: () => void;
	playlistID: string;
	refreshPlayList: () => void;
	shows: boolean;
}

function SongsManager({hide, playlistID, refreshPlayList, shows}: SongsManagerProps) {
	const {colors} = useTheme();
	const playlistsDB = useRef(new PlayListController());
	const songsDB = useRef(new SongsController());

	const [isBlocked, setIsBlocked] = useState(false);

	const [searchQuery, setSearchQuery] = useState('');
	const [searchedSongs, setSearchedSongs] = useState<SavedSongMetadata[]>([]);

	const [songs, setSongs] = useState<SavedSongMetadata[]>([]);

	const getSongs = useCallback(async () => {
		setSongs(useCompare(await songsDB.current.db.findAsync({$not: {'musicly.playlists.id': playlistID}}) as SavedSongMetadata[], (item: SavedSongMetadata) => item.musicly.file.downloadDate, true));
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

	useEffect(() => {
		setSearchedSongs([...songs]);
	}, [songs.length]);

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
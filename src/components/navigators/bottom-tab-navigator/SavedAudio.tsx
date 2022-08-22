import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import {Appbar, Searchbar, Text} from 'react-native-paper';
import {SongMetadata} from '../../../typings/interfaces';
import SavedAudioItem from '../../components/elements/SavedAudioItem';
import {SongsDatabase} from '../../schemas/schemas';


function SavedAudio() {
	const [filteredSongs, setFilteredSongs] = useState<SongMetadata[]>([]);

	const [searchQuery, setSearchQuery] = useState('');
	const [songs, setSongs] = useState<SongMetadata[]>([]);

	const getSongs = useCallback(async () => {
		const db = new SongsDatabase('songs');
		const songsArr = await db.find<SongMetadata[]>({});
		setSongs(songsArr);
		setFilteredSongs(songsArr);
	}, []);

	useEffect(() => {
		setFilteredSongs([...songs.filter(song => song.title.toLowerCase().match(searchQuery) || song.channel.name.toLowerCase().match(searchQuery))]);
	}, [songs]);

	useEffect(() => {
		getSongs();
	}, []);

	return (
		<View style={css.container}>
			<Appbar.Header elevated mode={'small'}>
				<Appbar.Content title={'Audio files saved by you'}/>
			</Appbar.Header>

			<SafeAreaView>
				<Searchbar
					onChangeText={setSearchQuery}
					//loading={isLoading}
					placeholder={'Search for saved song'}
					style={css.searchbar}
					value={searchQuery}/>
			</SafeAreaView>

			<FlatList
				data={filteredSongs}
				ListEmptyComponent={<Text style={css.textError}>You have no saved songs yet.</Text>}
				keyExtractor={item => item.id}
				renderItem={SavedAudioItem}/>
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
	textError: {
		margin: 5,
		textAlign: 'center'
	}
});

export default SavedAudio;
import axios from 'axios';
import React, {useState} from 'react';
import {ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TextInput, View} from 'react-native';
import {SongMetadata} from '../../../typings/interfaces';
import Song from '../../components/elements/Song';


function Search() {
	const [isLoading, setIsLoading] = useState(false);
	const [searchPhrase, setSearchPhrase] = useState('');
	const [songs, setSongs] = useState<SongMetadata[]>([]);

	const search = async () => {
		setIsLoading(true);
		if (searchPhrase) {
			try {
				const response = await axios({
					data: {},
					headers: {
						'Access-Control-Allow-Origin': '*'
					},
					method: 'get',
					responseType: 'json',
					url: '/search/youtube?keywords=' + encodeURI(searchPhrase)
				});

				setSongs(response.data);
			} catch (err) {
				// todo: handle errors feedback
				console.error(err.toJSON());
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<View style={css.container}>
			<SafeAreaView>
				<TextInput
					autoFocus
					onChangeText={setSearchPhrase}
					onEndEditing={search}
					placeholder={'Search for music'}/>
			</SafeAreaView>
			{isLoading ?
				<ActivityIndicator size={'large'}/>
				:
				<FlatList
					data={songs}
					keyExtractor={item => item.id}
					renderItem={Song}/>
			}
		</View>
	);
}

const css = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Search;
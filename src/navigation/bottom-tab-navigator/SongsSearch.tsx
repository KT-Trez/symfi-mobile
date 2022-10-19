import axios from 'axios';
import React, {useState} from 'react';
import {ActivityIndicator, FlatList, SafeAreaView, StyleSheet, ToastAndroid, View} from 'react-native';
import {Appbar, Searchbar, useTheme} from 'react-native-paper';
import {SavedSongMetadata} from '../../../typings/interfaces';
import Song from '../../screens/songs-search/Song';


function SongsSearch() {
	const {colors} = useTheme();

	const [isLoading, setIsLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [songs, setSongs] = useState<SavedSongMetadata[]>([]);

	const search = async () => {
		setIsLoading(true);
		if (searchQuery) {
			try {
				const response = await axios({
					data: {},
					headers: {
						'Access-Control-Allow-Origin': '*'
					},
					method: 'get',
					responseType: 'json',
					url: '/search/youtube?keywords=' + encodeURI(searchQuery)
				});

				setSongs(response.data);
			} catch (err) {
				console.error(err);
				ToastAndroid.showWithGravity('Server returned error code: ' + err.status, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<View style={[css.container, {backgroundColor: colors.background}]}>
			<Appbar.Header elevated mode={'small'}>
				<Appbar.Content title={'Search'}/>
			</Appbar.Header>

			<SafeAreaView>
				<Searchbar onChangeText={setSearchQuery}
						   onEndEditing={search}
						   placeholder={'Search for music'}
						   style={css.searchbar}
						   value={searchQuery}/>
			</SafeAreaView>

			{isLoading ?
				<ActivityIndicator size={'large'} style={css.activityIndicator}/>
				:
				<FlatList
					data={songs}
					keyExtractor={item => item.id}
					renderItem={({item}) => <Song item={item}/>}/>
			}
		</View>
	);
}

const css = StyleSheet.create({
	activityIndicator: {
		marginTop: 10
	},
	container: {
		flex: 1
	},
	searchbar: {
		margin: 5,
		marginBottom: 2.5
	}
});

export default SongsSearch;
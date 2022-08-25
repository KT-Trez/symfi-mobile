import axios from 'axios';
import React, {useState} from 'react';
import {ActivityIndicator, FlatList, SafeAreaView, StyleSheet, ToastAndroid, View} from 'react-native';
import {Appbar, Divider, Searchbar} from 'react-native-paper';
import {SavedSongMetadata} from '../../../../typings/interfaces';
import SearchResultItem from '../../elements/flatlist-items/SearchResultItem';


function AudioSearch() {
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
		<View style={css.container}>
			<Appbar.Header elevated mode={'small'}>
				<Appbar.Content title={'Search'}/>
			</Appbar.Header>
			<SafeAreaView>
				<Searchbar
					onChangeText={setSearchQuery}
					onEndEditing={search}
					//loading={isLoading}
					placeholder={'Search for music'}
					style={css.searchbar}
					value={searchQuery}/>
			</SafeAreaView>
			{isLoading ?
				<ActivityIndicator size={'large'} style={css.activityIndicator}/>
				:
				<FlatList
					data={songs}
					ItemSeparatorComponent={Divider}
					keyExtractor={item => item.id}
					renderItem={({item}) => <SearchResultItem item={item}/>}/>
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
		margin: 5
	}
});

export default AudioSearch;
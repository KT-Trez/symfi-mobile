import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, SafeAreaView, StyleSheet, ToastAndroid, View} from 'react-native';
import {Appbar, Menu, Searchbar, useTheme} from 'react-native-paper';
import {Musicly} from '../../../types';
import Song from '../../components/Song';
import useVisibility from '../../hooks/useVisibility';
import ResourceManager from '../../services/ResourceManager';
import ServerSetup from '../../views/songs-search/ServerSetup';
import SongActions from '../../views/songs-search/SongActions';


function SongsSearch() {
	const {colors} = useTheme();

	const [searchQuery, setSearchQuery] = useState('');

	const [selectedSong, setSelectedSong] = useState<Musicly.Api.MediaInfo>();
	const [songs, setSongs] = useState<Musicly.Api.MediaInfo[]>([]);

	const [isLoading, setIsLoading] = useState(false);
	const [hideMenu, menuShows, showMenu] = useVisibility();
	const [hideActionSheet, actionSheetShows, showActionSheet] = useVisibility([() => setSelectedSong(undefined)]);
	const [hideServerSetup, serverSetupShows, showServerSetup] = useVisibility(undefined, [hideMenu]);

	const search = useCallback(async () => {
		setIsLoading(true);
		if (searchQuery) {
			try {
				const response = await ResourceManager.Net.axios({
					method: 'get',
					responseType: 'json',
					url: '/v2/search/youtube?query=' + encodeURI(searchQuery)
				});

				setSongs(response.data);
			} catch (err) {
				console.error(err);
				ToastAndroid.showWithGravity('Server returned an error, try again later', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
			} finally {
				setIsLoading(false);
			}
		}
	}, [searchQuery]);

	useEffect(() => {
		if (selectedSong)
			showActionSheet();
	}, [selectedSong]);

	return (
		<View style={[css.container, {backgroundColor: colors.background}]}>
			<Appbar.Header elevated mode={'small'}>
				<Appbar.Content title={'Search'}/>

				<Menu anchor={<Appbar.Action icon={'dots-vertical'} onPress={showMenu}/>}
				      anchorPosition={'bottom'}
				      onDismiss={hideMenu}
				      visible={menuShows}>
					<Menu.Item leadingIcon={'server'} onPress={showServerSetup} title={'Change Server'}/>
				</Menu>
			</Appbar.Header>

			<SafeAreaView>
				<Searchbar onChangeText={setSearchQuery}
				           onEndEditing={search}
				           placeholder={'Search for music'}
				           style={css.searchbar}
				           value={searchQuery}/>
			</SafeAreaView>

			<ServerSetup hide={hideServerSetup} shows={serverSetupShows}/>

			{isLoading ?
				<ActivityIndicator size={'large'} style={css.activityIndicator}/>
				:
				<FlatList
					data={songs}
					keyExtractor={item => item.id}
					renderItem={({item}) =>
						<Song bottomLabel={item.metadata.views.label}
						      data={item}
						      imageURI={item.metadata.thumbnails[0].url}
						      onPressSelect={() => setSelectedSong(item)}/>
						// <Song item={item}/>
					}/>
			}

			<SongActions data={selectedSong}
			             hide={hideActionSheet}
			             isVisible={actionSheetShows}/>
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
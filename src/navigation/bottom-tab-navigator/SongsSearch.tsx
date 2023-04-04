import React, {useState} from 'react';
import {ActivityIndicator, FlatList, SafeAreaView, StyleSheet, ToastAndroid, View} from 'react-native';
import {Appbar, Menu, Searchbar, useTheme} from 'react-native-paper';
import {Musicly} from '../../../typings';
import useVisibility from '../../hooks/useVisibility';
import ResourceManager from '../../services/ResourceManager';
import ServerSetup from '../../views/songs-search/ServerSetup';
import Song from '../../views/songs-search/Song';


function SongsSearch() {
	const {colors} = useTheme();

	const [searchQuery, setSearchQuery] = useState('');
	const [songs, setSongs] = useState<Musicly.Api.MediaInfo[]>([]);

	const [isLoading, setIsLoading] = useState(false);
	const [hideMenu, menuShows, showMenu] = useVisibility();
	const [hideServerSetup, serverSetupShows, showServerSetup] = useVisibility(undefined, [hideMenu]);

	const search = async () => {
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
	};

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
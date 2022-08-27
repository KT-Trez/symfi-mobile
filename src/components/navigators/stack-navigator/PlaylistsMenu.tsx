import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Appbar, Divider} from 'react-native-paper';
import {PlaylistMetadata} from '../../../../typings/interfaces';
import {PlaylistDatabase} from '../../../schemas/schemas';
import Album from '../../elements/Album';
import PlaylistCreator from '../../elements/playlist/PlaylistCreator';


function PlaylistsMenu() {
	const playlistsDB = useRef(PlaylistDatabase.getInstance());

	const [playlists, setPlaylists] = useState<PlaylistMetadata[]>([]);

	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isVisible, setIsVisible] = useState(false);

	const getAlbums = useCallback(async () => {
		setIsRefreshing(true);
		setPlaylists(await playlistsDB.current.find<PlaylistMetadata[]>({}));
		setIsRefreshing(false);
	}, []);

	useEffect(() => {
		getAlbums();
	}, []);

	return (
		<View style={css.container}>
			<Appbar.Header elevated mode={'small'}>
				<Appbar.Content title={'Your playlists'}/>
			</Appbar.Header>

			<PlaylistCreator hideCreator={() => setIsVisible(false)}
							 isVisible={isVisible}
							 reloadList={getAlbums}
							 showCreator={() => setIsVisible(true)}/>

			<FlatList data={playlists}
					  ItemSeparatorComponent={Divider}
					  keyExtractor={item => item.id}
					  ListEmptyComponent={<Text style={css.textError}>You have no created playlists yet.</Text>}
					  onRefresh={getAlbums}
					  refreshing={isRefreshing}
					  renderItem={({item}) => <Album item={item}/>}/>
		</View>
	);
}

const css = StyleSheet.create({
	container: {
		flex: 1
	},
	textError: {
		margin: 15,
		textAlign: 'center'
	}
});

export default PlaylistsMenu;
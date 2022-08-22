import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Appbar, Divider} from 'react-native-paper';
import {PlaylistMetadata} from '../../../../typings/interfaces';
import {PlaylistDatabase} from '../../../schemas/schemas';
import Album from '../../elements/Album';
import AlbumCreator from '../../elements/AlbumCreator';


function PlaylistsMenu() {
	const [albums, setAlbums] = useState<PlaylistMetadata[]>([]);
	const [isVisible, setIsVisible] = useState(false);

	const getAlbums = useCallback(async () => {
		const db = new PlaylistDatabase('playlists');
		setAlbums(await db.find<PlaylistMetadata[]>({}));
	}, []);

	useEffect(() => {
		getAlbums();
	}, []);

	return (
		<View style={css.container}>
			<Appbar.Header elevated mode={'small'}>
				<Appbar.Content title={'Your playlists'}/>
			</Appbar.Header>
			<FlatList data={albums}
					  ItemSeparatorComponent={Divider}
					  keyExtractor={item => item._id}
					  ListEmptyComponent={<Text style={css.textError}>You have no created playlists yet.</Text>}
					  renderItem={({item}) => <Album item={item}/>}/>
			<AlbumCreator hideCreator={() => setIsVisible(false)}
						  isVisible={isVisible}
						  reloadList={getAlbums}
						  showCreator={() => setIsVisible(true)}/>
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
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Appbar, FAB, useTheme} from 'react-native-paper';
import {PlaylistMetadata} from '../../../typings/interfaces';
import EditDialog from '../../components/elements/playlist/EditDialog';
import PlaylistCreator from '../../components/elements/playlist/PlaylistCreator';
import {PlaylistDatabase} from '../../schemas/schemas';
import PlayList from '../../screens/play-lists-menu/PlayList';


function PlayListsMenu() {
	const playlistsDB = useRef(PlaylistDatabase.getInstance());
	const {colors} = useTheme();

	const [playListToManage, setPlayListToManage] = useState<string | undefined>(undefined);
	const [playlists, setPlaylists] = useState<PlaylistMetadata[]>([]);

	const [isRefreshing, setIsRefreshing] = useState(false);
	const [creatorVisible, setCreatorVisible] = useState(false);

	const getAlbums = useCallback(async () => {
		setIsRefreshing(true);
		setPlaylists(await playlistsDB.current.find<PlaylistMetadata[]>({}));
		setIsRefreshing(false);
	}, []);

	const hideCreator = () => setCreatorVisible(false);

	const showCreator = () => setCreatorVisible(true);

	useEffect(() => {
		getAlbums();
	}, []);

	return (
		<View style={[css.container, {backgroundColor: colors.background}]}>
			<Appbar.Header dark={true} elevated mode={'small'}>
				<Appbar.Content title={'Your playlists'}/>
			</Appbar.Header>

			<EditDialog playlistID={playListToManage}
						refreshPlaylistsList={getAlbums}
						setPlaylistID={setPlayListToManage}/>

			<PlaylistCreator hide={hideCreator}
							 isVisible={creatorVisible}
							 reloadList={getAlbums}/>

			<FlatList data={playlists}
					  keyExtractor={item => item.id}
					  ListEmptyComponent={<Text style={css.textError}>You have no created playlists yet.</Text>}
					  onRefresh={getAlbums}
					  refreshing={isRefreshing}
					  style={{position: 'relative'}}
					  renderItem={({item}) => <PlayList item={item} loadToManage={setPlayListToManage}/>}/>

			<FAB icon={'plus'}
				 onPress={showCreator}
				 style={css.fab}/>
		</View>
	);
}

const css = StyleSheet.create({
	container: {
		flex: 1,
		position: 'relative'
	},
	fab: {
		bottom: 10,
		position: 'absolute',
		right: 10
	},
	textError: {
		margin: 15,
		textAlign: 'center'
	}
});

export default PlayListsMenu;
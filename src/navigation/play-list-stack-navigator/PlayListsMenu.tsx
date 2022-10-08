import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Appbar, FAB, Text, useTheme} from 'react-native-paper';
import {PlaylistMetadata} from '../../../typings/interfaces';
import PlayListController from '../../datastore/PlayListController';
import Creator from '../../screens/play-lists-menu/Creator';
import EditDialog from '../../screens/play-lists-menu/EditDialog';
import PlayList from '../../screens/play-lists-menu/PlayList';


function PlayListsMenu() {
	// constants
	const {colors} = useTheme();
	const playlistsDB = useRef(new PlayListController());

	const [playListToManage, setPlayListToManage] = useState<string | undefined>(undefined);
	const [playlists, setPlaylists] = useState<PlaylistMetadata[]>([]);

	const [isRefreshing, setIsRefreshing] = useState(false);
	const [creatorVisible, setCreatorVisible] = useState(false);

	const getPlayLists = useCallback(async () => {
		setIsRefreshing(true);
		setPlaylists(await playlistsDB.current.db.findAsync({}) as PlaylistMetadata[]);
		setIsRefreshing(false);
	}, []);

	const hideCreator = () => setCreatorVisible(false);

	const showCreator = () => setCreatorVisible(true);

	useEffect(() => {
		getPlayLists();
	}, []);

	return (
		<View style={[css.container, {backgroundColor: colors.background}]}>
			<Appbar.Header dark={true} elevated mode={'small'}>
				<Appbar.Content title={playlists.length + ' PlayLists'}/>
			</Appbar.Header>

			<EditDialog playlistID={playListToManage}
						refreshPlaylistsList={getPlayLists}
						setPlaylistID={setPlayListToManage}/>

			<Creator hide={hideCreator}
							 isVisible={creatorVisible}
							 reloadList={getPlayLists}/>

			<FlatList data={playlists}
					  keyExtractor={item => item.id}
					  ListEmptyComponent={<Text style={css.textError} variant={'bodyMedium'}>You have no playLists yet.</Text>}
					  onRefresh={getPlayLists}
					  refreshing={isRefreshing}
					  renderItem={({item}) => <PlayList item={item} loadToManage={setPlayListToManage}/>}
					  style={css.flatList}/>

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
	flatList: {
		paddingBottom: 2.5,
		paddingTop: 2.5
	},
	textError: {
		margin: 15,
		textAlign: 'center'
	}
});

export default PlayListsMenu;
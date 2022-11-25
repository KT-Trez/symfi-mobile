import {NavigationContext} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Appbar, FAB, Menu, Provider, Text, useTheme} from 'react-native-paper';
import {PlaylistMetadata} from '../../../typings/interfaces';
import PlayListController from '../../datastore/PlayListController';
import Creator from '../../screens/play-lists-menu/Creator';
import EditDialog from '../../screens/play-lists-menu/EditDialog';
import PlayList from '../../screens/play-lists-menu/PlayList';


function PlayListsMenu() {
	// constants
	const {colors} = useTheme();
	const navigation = useContext(NavigationContext);
	const playlistsDB = useRef(new PlayListController());

	const [playListToManage, setPlayListToManage] = useState<string | undefined>(undefined);
	const [playlists, setPlaylists] = useState<PlaylistMetadata[]>([]);

	const [creatorVisible, setCreatorVisible] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [menuVisible, setMenuVisible] = useState(false);

	const getPlayLists = useCallback(async () => {
		setIsRefreshing(true);
		setPlaylists((await playlistsDB.current.db.findAsync({})).sort((a, b) => a.order - b.order) as PlaylistMetadata[]);
		setIsRefreshing(false);
	}, []);

	const goToPlayListOrder = () => navigation?.navigate('PlayListOrder');

	const hideCreator = () => setCreatorVisible(false);

	const hideMenu = () => setMenuVisible(false);

	const showCreator = () => setCreatorVisible(true);

	const showMenu = () => setMenuVisible(true);

	useEffect(() => {
		getPlayLists();
	}, []);

	return (
		<Provider>
			<View style={[css.container, {backgroundColor: colors.background}]}>
				<Appbar.Header dark={true} elevated mode={'small'}>
					<Appbar.Content title={playlists.length + ' PlayLists'}/>

					<Menu anchor={<Appbar.Action icon={'dots-vertical'} onPress={showMenu}/>}
						  anchorPosition={'bottom'}
						  onDismiss={hideMenu}
						  visible={menuVisible}>
						<Menu.Item leadingIcon={'delete-forever'} title={'Delete'}/>
						<Menu.Item leadingIcon={'pencil'} title={'Edit'}/>
						<Menu.Item leadingIcon={'format-list-bulleted-type'}
								   onPress={goToPlayListOrder}
								   title={'Change order'}/>
						<Menu.Item leadingIcon={'cog'} title={'Settings'}/>
					</Menu>
				</Appbar.Header>

				<Creator hide={hideCreator}
						 isVisible={creatorVisible}
						 reloadList={getPlayLists}/>

				<EditDialog playlistID={playListToManage}
							refreshPlaylistsList={getPlayLists}
							setPlaylistID={setPlayListToManage}/>

				<FlatList data={playlists}
						  keyExtractor={item => item.id}
						  ListEmptyComponent={
							  <Text style={css.flatListText} variant={'bodyMedium'}>You have no playLists yet.</Text>
						  }
						  onRefresh={getPlayLists}
						  refreshing={isRefreshing}
						  renderItem={({item}) => <PlayList item={item} loadToManage={setPlayListToManage}/>}
						  style={css.flatList}/>

				<FAB icon={'plus'}
					 onPress={showCreator}
					 style={css.fab}/>
			</View>
		</Provider>
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
	flatListText: {
		margin: 15,
		textAlign: 'center'
	}
});

export default PlayListsMenu;
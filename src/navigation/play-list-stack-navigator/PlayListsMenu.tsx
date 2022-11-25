import {NavigationContext} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Appbar, FAB, Menu, Provider, Text, useTheme} from 'react-native-paper';
import {Musicly} from '../../../typings';
import Creator from '../../screens/play-lists-menu/Creator';
import EditDialog from '../../screens/play-lists-menu/EditDialog';
import PlayList from '../../screens/play-lists-menu/PlayList';
import ResourceManager, {PlayList as CPlayList} from '../../services/ResourceManager';


function PlayListsMenu() {
	// constants
	const {colors} = useTheme();
	const navigation = useContext(NavigationContext);

	const [playlists, setPlaylists] = useState<CPlayList[]>([]);

	const [playListToManage, setPlayListToManage] = useState<CPlayList | null>(null);
	const [manageDialogOptions, setManageDialogOptions] = useState<Musicly.Components.ManageDialogOptions | null>(null);

	const [creatorShows, setCreatorShows] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [menuShows, setMenuShows] = useState(false);

	const getPlayLists = useCallback(async () => {
		setIsRefreshing(true);
		setPlaylists((await ResourceManager.PlayList.deserializeAll()).sort((a, b) => a.order - b.order));
		setIsRefreshing(false);
	}, []);

	const goToPlayListOrder = () => navigation?.navigate('PlayListOrder');

	// showing and hiding elements
	const hideCreator = () => setCreatorShows(false);

	const hideDeleteAndEditDialog = () => {
		setManageDialogOptions(null);
	};

	const hideMenu = () => setMenuShows(false);

	const showCreator = () => setCreatorShows(true);

	const showDeleteDialog = () => {
		hideMenu();
		setManageDialogOptions({
			isDelete: true,
			message: 'This action is permanent, are you sure?',
			title: 'Delete'
		});
	};

	const showEditDialog = () => {
		hideMenu();
		setManageDialogOptions({
			isEdit: true
		});
	};

	const showMenu = () => setMenuShows(true);

	// effects
	useEffect(() => {
		getPlayLists();
	}, []);

	return (
		<Provider>
			<View style={[css.container, {backgroundColor: colors.background}]}>
				<Appbar.Header dark={true} elevated mode={'small'}>
					{!manageDialogOptions?.isDelete && !manageDialogOptions?.isEdit ?
						<Appbar.Content title={playlists.length + ' PlayLists'}/>
						:
						<Appbar.Action icon={'cancel'} onPress={hideDeleteAndEditDialog} style={{marginRight: 'auto'}}/>
					}

					<Menu anchor={<Appbar.Action icon={'dots-vertical'} onPress={showMenu}/>}
						  anchorPosition={'bottom'}
						  onDismiss={hideMenu}
						  visible={menuShows}>
						<Menu.Item leadingIcon={'delete'} onPress={showDeleteDialog} title={'Delete'}/>
						<Menu.Item leadingIcon={'pencil'} onPress={showEditDialog} title={'Edit'}/>
						<Menu.Item leadingIcon={'format-list-bulleted-type'}
								   onPress={goToPlayListOrder}
								   title={'Order'}/>
						<Menu.Item leadingIcon={'cog'} title={'Settings'}/>
					</Menu>
				</Appbar.Header>

				<Creator hide={hideCreator}
						 isVisible={creatorShows}
						 reloadList={getPlayLists}/>

				<EditDialog options={manageDialogOptions}
							playList={playListToManage}
							refreshPlaylistsList={getPlayLists}
							setPlayList={setPlayListToManage}/>

				<FlatList data={playlists}
						  keyExtractor={item => item.id}
						  ListEmptyComponent={
							  <Text style={css.flatListText} variant={'bodyMedium'}>You have no playLists yet.</Text>
						  }
						  onRefresh={getPlayLists}
						  refreshing={isRefreshing}
						  renderItem={({item}) => <PlayList manageOptions={manageDialogOptions}
															item={item}
															setPlayList={setPlayListToManage}/>}
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
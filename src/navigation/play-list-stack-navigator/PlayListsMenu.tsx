import {NavigationContext} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Appbar, FAB, Menu, Provider, Text, useTheme} from 'react-native-paper';
import {Musicly} from '../../../typings';
import Creator from '../../views/play-lists-menu/Creator';
import EditDialog from '../../views/play-lists-menu/EditDialog';
import PlayList from '../../views/play-lists-menu/PlayList';
import ResourceManager, {PlayList as CPlayList} from '../../services/ResourceManager';
import useCompare from '../../hooks/useCompare';


function PlayListsMenu() {
	// constants
	const {colors} = useTheme();
	const navigation = useContext(NavigationContext);

	const [playlists, setPlaylists] = useState<CPlayList[]>([]);

	// todo: prevent going back
	const [manageDialogOptions, setManageDialogOptions] = useState<Musicly.Components.ManageDialogOptions | null>(null);

	const [creatorShows, setCreatorShows] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [menuShows, setMenuShows] = useState(false);
	const [sortShows, setSortShows] = useState(false);

	const getPlayLists = useCallback(async () => {
		setIsRefreshing(true);
		setPlaylists(useCompare<CPlayList>(await ResourceManager.PlayList.deserializeAll(), (item) => item.order));
		setIsRefreshing(false);
	}, []);

	const goToPlayListOrder = () => navigation?.navigate('PlayListOrder');

	const goToSettings = () => navigation?.navigate('Settings');

	// showing and hiding elements
	const hideCreator = () => setCreatorShows(false);

	const hideDeleteAndEditDialog = () => {
		setManageDialogOptions(null);
	};

	const hideMenu = () => setMenuShows(false);

	const hideSort = () => setSortShows(false);

	const showCreator = () => setCreatorShows(true);

	const showDeleteDialog = () => {
		hideMenu();
		setManageDialogOptions({
			isDelete: true
		});
	};

	const showEditDialog = () => {
		hideMenu();
		setManageDialogOptions({
			isEdit: true
		});
	};

	const showMenu = () => setMenuShows(true);

	const showSort = () => setSortShows(true);

	// sorting playLists
	const sortByNameAscending = () => {
		setPlaylists(arr => useCompare(arr, item => item.name));
		hideSort();
	};
	const sortByNameDescending = () => {
		setPlaylists(arr => useCompare(arr, item => item.name, true));
		hideSort();
	};

	const sortByOrderAscending = () => {
		setPlaylists(arr => useCompare(arr, item => item.order));
		hideSort();
	};
	const sortByOrderDescending = () => {
		setPlaylists(arr => useCompare(arr, item => item.order, true));
		hideSort();
	};

	// effects
	useEffect(() => {
		getPlayLists();
	}, []);

	return (
		<Provider>
			<View style={[css.container, {backgroundColor: colors.background}]}>
				<Appbar.Header dark={true} elevated mode={'small'}>
					{(!manageDialogOptions || manageDialogOptions.isManage) &&
						<Appbar.Content title={playlists.length + ' PlayLists'}/>
					}

					{!manageDialogOptions || manageDialogOptions.isManage ?
						<>
							<Menu anchor={<Appbar.Action icon={'sort'} onPress={showSort}/>}
								  anchorPosition={'bottom'}
								  onDismiss={hideSort}
								  visible={sortShows}>
								<Menu.Item leadingIcon={'sort-alphabetical-ascending'}
										   onPress={sortByNameAscending}
										   title={'Asc by name'}/>
								<Menu.Item leadingIcon={'sort-alphabetical-descending'}
										   onPress={sortByNameDescending}
										   title={'Dsc by name'}/>
								<Menu.Item leadingIcon={'sort-numeric-ascending'}
										   onPress={sortByOrderAscending}
										   title={'Asc by order'}/>
								<Menu.Item leadingIcon={'sort-numeric-descending'}
										   onPress={sortByOrderDescending}
										   title={'Dsc by order'}/>
							</Menu>

							<Menu anchor={<Appbar.Action icon={'dots-vertical'} onPress={showMenu}/>}
								  anchorPosition={'bottom'}
								  onDismiss={hideMenu}
								  visible={menuShows}>
								<Menu.Item leadingIcon={'delete'} onPress={showDeleteDialog} title={'Delete'}/>
								<Menu.Item leadingIcon={'pencil'} onPress={showEditDialog} title={'Edit'}/>
								<Menu.Item leadingIcon={'format-list-bulleted-type'}
										   onPress={goToPlayListOrder}
										   title={'Order'}/>
								<Menu.Item leadingIcon={'cog'} onPress={goToSettings} title={'Settings'}/>
							</Menu>
						</>
						:
						<Appbar.Action icon={'cancel'} onPress={hideDeleteAndEditDialog} style={{marginLeft: 'auto'}}/>
					}
				</Appbar.Header>

				<Creator hide={hideCreator}
						 isVisible={creatorShows}
						 reloadList={getPlayLists}/>

				<EditDialog options={manageDialogOptions}
							refreshPlaylistsList={getPlayLists}
							setOptions={setManageDialogOptions}/>

				<FlatList data={playlists}
						  keyExtractor={item => item.id}
						  ListEmptyComponent={
							  <Text style={css.flatListText} variant={'bodyMedium'}>You have no playlists yet.</Text>
						  }
						  onRefresh={getPlayLists}
						  refreshing={isRefreshing}
						  renderItem={({item}) => <PlayList manageOptions={manageDialogOptions}
															item={item}
															setManageDialogOptions={setManageDialogOptions}/>}
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
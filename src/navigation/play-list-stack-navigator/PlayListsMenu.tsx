import {NavigationContext} from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Appbar, FAB, Menu, Provider, Text, useTheme} from 'react-native-paper';
import {Musicly} from '../../../types';
import usePlayLists from '../../hooks/usePlayLists';
import useVisibility from '../../hooks/useVisibility';
import Creator from '../../views/play-lists-menu/Creator';
import EditDialog from '../../views/play-lists-menu/EditDialog';
import PlayList from '../../views/play-lists-menu/PlayList';


function PlayListsMenu() {
	// constants
	const {colors} = useTheme();
	const navigation = useContext(NavigationContext);

	const [isLoading, playLists, refreshPlayLists, sortPlayLists] = usePlayLists();

	// todo: prevent going back
	const [manageDialogOptions, setManageDialogOptions] = useState<Musicly.Components.ManageDialogOptions | null>(null);

	const [hideCreator, creatorShows, showCreator] = useVisibility();
	const [hideMenu, menuShows, showMenu] = useVisibility();
	const [hideSort, sortShows, showSort] = useVisibility();

	const goToPlayListOrder = () => navigation?.navigate('PlayListOrder');

	const goToSettings = () => navigation?.navigate('Settings');

	// showing and hiding elements
	const hideDeleteAndEditDialog = () => {
		setManageDialogOptions(null);
	};

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

	// sorting playLists
	const sortByNameAscending = () => {
		sortPlayLists(item => item.name);
		hideSort();
	};
	const sortByNameDescending = () => {
		sortPlayLists(item => item.name, true);
		hideSort();
	};

	const sortByOrderAscending = () => {
		sortPlayLists(item => item.order);
		hideSort();
	};
	const sortByOrderDescending = () => {
		sortPlayLists(item => item.order, true);
		hideSort();
	};

	return (
		<Provider>
			<View style={[css.container, {backgroundColor: colors.background}]}>
				<Appbar.Header dark={true} elevated mode={'small'}>
					{(!manageDialogOptions || manageDialogOptions.isManage) &&
						<Appbar.Content title={playLists.length + (playLists.length !== 1 ? ' playlists' : ' playlist')}/>
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
						 reloadList={refreshPlayLists}/>

				<EditDialog options={manageDialogOptions}
							refreshPlaylistsList={refreshPlayLists}
							setOptions={setManageDialogOptions}/>

				<FlatList data={playLists}
						  keyExtractor={item => item.id}
						  ListEmptyComponent={
							  <Text style={css.flatListText} variant={'bodyMedium'}>You have no playlists yet.</Text>
						  }
						  onRefresh={refreshPlayLists}
						  refreshing={isLoading}
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
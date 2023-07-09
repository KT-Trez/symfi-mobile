import {MaterialCommunityIcons} from '@expo/vector-icons';
import {NavigationContext} from '@react-navigation/native';
import {Fab, FlatList, Icon, Menu, Text} from 'native-base';
import React, {useContext, useState} from 'react';
import {AppBar, AppBarButton} from '../../../components/AppBar';
import useOpen from '../../../hooks/useOpen';
import usePlayLists from '../../../hooks/usePlayLists';
import PlayList from './PlayList';
import PlayListActions from './PlayListActions';
import PlayListCreator from './PlayListCreator';


function List() {
    // constants
    const navigation = useContext(NavigationContext);

    // state
    const [actionsFor, setActionsFor] = useState<string | undefined>();

    const [isLoading, playLists, refreshPlayLists, sortPlayLists] = usePlayLists();

    // methods
    const closeActions = () => setActionsFor(undefined);

    const goToPlayListOrder = () => navigation?.navigate('PlayListOrder');

    // showing and hiding elements
    const [hideCreator, creatorShows, showCreator] = useOpen();

    // sorting playLists
    const sortByNameAscending = () => sortPlayLists(item => item.name);
    const sortByNameDescending = () => sortPlayLists(item => item.name, true);
    const sortByOrderAscending = () => sortPlayLists(item => item.order);
    const sortByOrderDescending = () => sortPlayLists(item => item.order, true);

    return (
        <>
            <AppBar subtitle={`${playLists.length} playlist${playLists.length != 1 ? 's' : ''}`} title={'Home'}>
                <Menu trigger={triggerProps => <AppBarButton icon={'sort'} triggerProps={triggerProps}/>}>
                    <Menu.Item onPress={sortByNameAscending}>
                        <Icon as={MaterialCommunityIcons} name={'sort-alphabetical-ascending'} size={'md'}/>
                        <Text>Asc by title</Text>
                    </Menu.Item>
                    <Menu.Item onPress={sortByNameDescending}>
                        <Icon as={MaterialCommunityIcons} name={'sort-alphabetical-descending'} size={'md'}/>
                        <Text>Desc by title</Text>
                    </Menu.Item>

                    <Menu.Item onPress={sortByOrderAscending}>
                        <Icon as={MaterialCommunityIcons} name={'sort-numeric-ascending'} size={'md'}/>
                        <Text>Asc by order</Text>
                    </Menu.Item>
                    <Menu.Item onPress={sortByOrderDescending}>
                        <Icon as={MaterialCommunityIcons} name={'sort-numeric-descending'} size={'md'}/>
                        <Text>Desc by order</Text>
                    </Menu.Item>
                </Menu>

                <Menu trigger={triggerProps => <AppBarButton icon={'dots-vertical'} triggerProps={triggerProps}/>}>
                    <Menu.Item onPress={goToPlayListOrder}>
                        <Icon as={MaterialCommunityIcons} name={'format-list-bulleted-type'} size={'md'}/>
                        <Text>Change Order</Text>
                    </Menu.Item>
                </Menu>
            </AppBar>

            {creatorShows &&
                <PlayListCreator hide={hideCreator}
                                 isVisible={creatorShows}
                                 refreshList={refreshPlayLists}/>
            }

            <FlatList bgColor={'primary.100'}
                      data={playLists}
                      keyExtractor={item => item.id}
                      ListEmptyComponent={
                          <Text fontSize={'md'} mt={'5'} textAlign={'center'}>You have no playlists yet.</Text>
                      }
                      onRefresh={refreshPlayLists}
                      pb={1}
                      pt={1}
                      refreshing={isLoading}
                      renderItem={({item}) =>
                          <PlayList item={item}
                                    selectOnPress={setActionsFor}/>}
            />

            <Fab bottom={2}
                 icon={<Icon as={MaterialCommunityIcons} name={'plus'} size={'xl'}/>}
                 onPress={showCreator}
                 renderInPortal={false}
                 right={2}/>

            <PlayListActions close={closeActions}
                             isOpen={!!actionsFor}
                             playListId={actionsFor}
                             refreshPlayListsList={refreshPlayLists}/>
        </>
    );
}

export default List;

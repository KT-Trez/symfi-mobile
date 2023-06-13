import {MaterialCommunityIcons} from '@expo/vector-icons';
import {RouteProp, useRoute} from '@react-navigation/native';
import {FlatList, Icon, Menu, Text} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {Musicly} from '../../../../types';
import {RootPlayListsStackParamList} from '../../../../types/navigation';
import {AppBar, AppBarButton} from '../../../components/AppBar';
import {Song} from '../../../components/Song';
import {Store} from '../../../datastore/Store';
import useCompare from '../../../hooks/useCompare';
import useVisibility from '../../../hooks/useVisibility';
import ResourceManager, {Song as SongC} from '../../../services/ResourceManager';
import SongActions from './SongActions';
import SongsAdder from './SongsAdder';


type ProfileScreenRouteProp = RouteProp<RootPlayListsStackParamList, 'PlaylistContent'>;

function PlayListContent() {
    const route = useRoute<ProfileScreenRouteProp>();
    const playlistID = route.params?.id;

    const [songs, setSongs] = useState<SongC[]>([]);

    const [actionsFor, setActionsFor] = useState<string | undefined>();
    const [currentSongID, setCurrentSongID] = useState<string | undefined>();

    const [closeAudioPlayer, isAudioPlayerOpen, openAudioPlayer] = useVisibility();
    const [closeSongsAdder, isSongsAdderOpen, openSongsAdder] = useVisibility();

    const closeActions = () => setActionsFor(undefined);

    // todo: move to hook
    const getSongs = useCallback(async () => {
        const songArr: SongC[] = [];
        const playListItems = await Store.songPlayLists.findAsync({playListID: playlistID}) as Musicly.Data.SongPlayList[];
        for (const playListItem of playListItems)
            songArr.push(await (await ResourceManager.Song.deserialize(playListItem.songID)).loadPlayList(playListItem));

        setSongs(useCompare(songArr, item => item.musicly.playList?.order ?? item.title));
    }, []);

    // sorting songs
    const sortByTitleAscending = () => setSongs(arr => useCompare(arr, item => item.title));
    const sortByTitleDescending = () => setSongs(arr => useCompare(arr, item => item.title, true));
    const sortByDownloadDateAscending = () => setSongs(arr => useCompare(arr, item => item.musicly.file.downloadDate));
    const sortByDownloadDateDescending = () => setSongs(arr => useCompare(arr, item => item.musicly.file.downloadDate, true));

    useEffect(() => {
        getSongs();
    }, []);

    return (
        <>
            <AppBar subtitle={songs.length + (songs.length !== 1 ? ' songs' : ' song')} title={'Playlist'}>
                <Menu trigger={triggerProps => <AppBarButton icon={'sort'} triggerProps={triggerProps}/>}>
                    <Menu.Item onPress={sortByDownloadDateAscending}>
                        <Icon as={MaterialCommunityIcons} name={'sort-calendar-ascending'} size={'md'}/>
                        <Text>Asc by date</Text>
                    </Menu.Item>
                    <Menu.Item onPress={sortByDownloadDateDescending}>
                        <Icon as={MaterialCommunityIcons} name={'sort-calendar-descending'} size={'md'}/>
                        <Text>Dsc by date</Text>
                    </Menu.Item>

                    <Menu.Item onPress={sortByTitleAscending}>
                        <Icon as={MaterialCommunityIcons} name={'sort-alphabetical-ascending'} size={'md'}/>
                        <Text>Asc by title</Text>
                    </Menu.Item>
                    <Menu.Item onPress={sortByTitleDescending}>
                        <Icon as={MaterialCommunityIcons} name={'sort-alphabetical-descending'} size={'md'}/>
                        <Text>Desc by title</Text>
                    </Menu.Item>
                </Menu>

                <Menu trigger={triggerProps => <AppBarButton icon={'dots-vertical'} triggerProps={triggerProps}/>}>
                    <Menu.Item onPress={openSongsAdder}>
                        <Icon as={MaterialCommunityIcons} name={'playlist-plus'} size={'md'}/>
                        <Text>Add Song</Text>
                    </Menu.Item>
                </Menu>
            </AppBar>

            {/*<AudioPlayer audioID={currentSongID} setAudioID={setCurrentSongID} songs={songs}/>*/}
            {/*<NewAudioPlayer shows={closeAudioPlayer} tracks={songs.map(song => new TrackAdapter(song))}/>*/}

            {isSongsAdderOpen &&
                <SongsAdder close={closeSongsAdder}
                            playListID={playlistID}
                            refreshPlayList={getSongs}
                            isOpen={isSongsAdderOpen}/>
            }

            <FlatList bg={'primary.50'}
                      data={songs}
                      ListEmptyComponent={
                          <Text fontSize={'md'} mt={'5'} textAlign={'center'}>This playlist is empty.</Text>
                      }
                      renderItem={({item}) =>
                          <Song bottomLabel={`${Math.round((item.musicly.file.size ?? 0) / 1024 / 1024 * 100) / 100}MB`}
                                data={item}
                                selectOnPress={setCurrentSongID}
                                selectOnLongPress={setActionsFor}/>}
            />

            <SongActions close={closeActions}
                         isOpen={!!actionsFor}
                         playListId={playlistID}
                         refreshSongsList={getSongs}
                         songId={actionsFor}/>
        </>
    );
}

export default PlayListContent;

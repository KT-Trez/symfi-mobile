import { FlatList, Text } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import { AppBar } from '../../../components/AppBar';
import DeprecatedAudioPlayer from '../../../components/DeprecatedAudioPlayer';
import { SearchBar } from '../../../components/SearchBar';
import { Song } from '../../../components/SongCard';
import useSongs from '../../../hooks/useSongs';
import { Song as SongR } from '../../../services/ResourceManager';
import SongActions from './SongActions';


function List() {
    const [actionsFor, setActionsFor] = useState<string | undefined>();
    const [inPlaybackId, setInPlaybackId] = useState<string | undefined>();

    const [isLoading, songs, refreshSongs] = useSongs();
    const [queriedSongs, setQueriedSongs] = useState<SongR[]>([]);

    const closeActions = useCallback(() => setActionsFor(undefined), []);

    useEffect(() => {
        setQueriedSongs(songs);
    }, [songs]);

    //  todo: implement filters
    // const [sort, setSort] = useState<{ ascending: boolean, type: 'author' | 'date' | 'duration' | 'title' } | null>(null);

    return (
        <>
            <AppBar subtitle={songs.length + (songs.length !== 1 ? ' songs' : ' song')} title={'Local Audio'}/>

      <DeprecatedAudioPlayer audioID={inPlaybackId} setAudioID={setInPlaybackId} songs={songs} />

            {/* todo: searchbar */}
            <SearchBar data={songs}
                       placeholder={'Search Songs'}
                       searchFnOne={song => song.title}
                       searchFnTwo={song => song.channel.name}
                       setSearchedData={setQueriedSongs}
            />

            <FlatList bgColor={'primary.100'}
                      data={queriedSongs}
                      keyExtractor={(item) => item.id}
                      ListEmptyComponent={
                          <Text fontSize={'md'} mt={'5'} textAlign={'center'}>You have no saved songs yet.</Text>
                      }
                      onRefresh={refreshSongs}
                      mt={-0.5}
                      pb={1}
                      refreshing={isLoading}
                      renderItem={({item}) =>
                          <Song
                              bottomLabel={`${Math.round((item.musicly.file.size ?? 0) / 1024 / 1024 * 100) / 100}MB`}
                              data={item}
                              selectOnLongPress={setActionsFor}
                              selectOnPress={setInPlaybackId}/>
                      }
            />

            <SongActions close={closeActions}
                         isOpen={!!actionsFor}
                         refreshSongsList={refreshSongs}
                         songId={actionsFor}
            />
        </>
    );
}

export default List;

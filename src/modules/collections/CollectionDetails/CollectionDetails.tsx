import { RouteProp, useRoute } from '@react-navigation/native';
import { useCallback } from 'react';
import type { CollectionNavigatorParams, SongType } from 'types';
import { Musicly } from '../../../../types';
import { SavedSongMetadata } from '../../../../types/interfaces';
import { AudioPlayer, List, PageHeader, useAudioPlayer } from '../../../components';
import { ListProvider, useList } from '../../../contexts';
import SongsController from '../../../datastore/SongsController';
import { Store } from '../../../datastore/Store';
import { useCollection } from '../../../hooks';
import { usePluralFormV2 } from '../../../hooks/usePluralFormV2';
import { SongAdapter } from '../../../models/Song';
import { usePageHeaderActions } from './hooks';
import { Song } from './Song';

type CollectionDetailsRouteProp = RouteProp<CollectionNavigatorParams, 'CollectionDetails'>;

export const CollectionDetails = () => {
  const {
    params: { id },
  } = useRoute<CollectionDetailsRouteProp>();

  const onFetch = useCallback(async () => {
    const songs: SongType[] = [];
    const playListItems = (await Store.songPlayLists.findAsync({ playListID: id })) as Musicly.Data.SongPlayList[];

    const songsToFetch = playListItems
      .map(({ songID }) => songID)
      .concat((await Store.playLists.findOneAsync({ id }))?.songs ?? []);

    for (const songID of songsToFetch) {
      const song = (await SongsController.store.findOneAsync({ id: songID })) as SavedSongMetadata;
      songs.push(new SongAdapter(song));
    }

    return songs;
  }, [id]);

  return (
    <ListProvider onFetch={onFetch}>
      <CollectionDetailsComponent />
    </ListProvider>
  );
};

export const CollectionDetailsComponent = () => {
  const { currentSong } = useAudioPlayer();
  const { displayedData, isLoading, reload } = useList<SongType>();
  const actions = usePageHeaderActions();
  const { s } = usePluralFormV2(displayedData.length);
  const {
    params: { id },
  } = useRoute<CollectionDetailsRouteProp>();

  const { collection } = useCollection(id);

  return (
    <PageHeader
      actions={actions}
      subtitle={`${displayedData.length} item${s}`}
      title={`Collection: ${collection?.name}`}
    >
      {currentSong && <AudioPlayer />}
      <List
        data={displayedData}
        isLoading={isLoading}
        onRefresh={reload}
        renderItem={({ item }) => <Song item={item} />}
      />
    </PageHeader>
  );
};

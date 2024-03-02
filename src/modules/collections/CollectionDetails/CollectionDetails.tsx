import { AudioPlayer, List, PageHeader, useAudioPlayer } from '@components';
import { useListContextProps, usePluralFormV2 } from '@hooks';
import { CollectionModel, SongModel } from '@models';
import { type RouteProp, useRoute } from '@react-navigation/native';
import { useObject, useQuery } from '@realm/react';
import type { CollectionNavigatorParams, SongListItem } from '@types';
import { useMemo } from 'react';
import { CollectionDetailsContext, useList } from './context';
import { usePageHeaderActions } from './hooks';
import { Song } from './Song';

type CollectionDetailsRouteProp = RouteProp<CollectionNavigatorParams, 'CollectionDetails'>;

export const CollectionDetails = () => {
  const {
    params: { id },
  } = useRoute<CollectionDetailsRouteProp>();

  const { currentSong } = useAudioPlayer();
  const { items } = useList();
  const collection = useObject(CollectionModel, new Realm.BSON.ObjectId(id));
  const actions = usePageHeaderActions();
  const { s } = usePluralFormV2(items.length);

  const songs = useQuery(SongModel);
  const filteredSongs = useMemo(() => songs.filtered(`$0 in collections`, new Realm.BSON.ObjectId(id)), [id, songs]);
  const value = useListContextProps<SongListItem, SongModel>(filteredSongs);

  return (
    <CollectionDetailsContext.Provider value={value}>
      <PageHeader actions={actions} subtitle={`${items.length} item${s}`} title={`Collection: ${collection?.name}`}>
        {currentSong && <AudioPlayer />}
        <List data={items} isLoading={false} renderItem={({ item }) => <Song item={item} />} />
      </PageHeader>
    </CollectionDetailsContext.Provider>
  );
};

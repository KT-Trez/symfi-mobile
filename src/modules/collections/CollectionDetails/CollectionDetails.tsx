import { List, PageHeader, useAudioPlayer } from '@components';
import { usePluralFormV3 } from '@hooks';
import { CollectionModel, SongModel } from '@models';
import { type RouteProp, useRoute } from '@react-navigation/native';
import { Realm, useObject, useQuery } from '@realm/react';
import type { CollectionNavigatorParams } from '@types';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { useFABActions } from './hooks';
import { Song } from './Song';

type CollectionDetailsRouteProp = RouteProp<CollectionNavigatorParams, 'CollectionDetails'>;

export const CollectionDetails = () => {
  const {
    params: { id },
  } = useRoute<CollectionDetailsRouteProp>();

  const { currentSong } = useAudioPlayer();
  const fabActions = useFABActions();
  const collection = useObject(CollectionModel, new Realm.BSON.ObjectId(id));
  // const actions = usePageHeaderActions();
  const songs = useQuery(SongModel);
  const [isFabOpen, setIsFabOpen] = useState<boolean>(false);

  const handleFabToggle = useCallback(() => setIsFabOpen(prevState => !prevState), []);

  const filteredSongs = useMemo(() => songs.filtered(`$0 in collections`, new Realm.BSON.ObjectId(id)), [id, songs]);
  const s = usePluralFormV3(songs.length);

  return (
    <PageHeader subtitle={`${songs.length} item${s}`} title={`Collection: ${collection?.name}`}>
      {/*{currentSong && <AudioPlayer />}*/}
      {/* @ts-ignore */}
      <List data={filteredSongs} isLoading={false} renderItem={({ item }) => <Song item={item} />} />

      <FAB.Group
        actions={fabActions}
        icon="playlist-music"
        open={isFabOpen}
        onStateChange={handleFabToggle}
        style={styles.fab}
        visible
      />
    </PageHeader>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});

import { AudioPlayer, List, PageHeader, SongPicker } from '@components';
import { usePluralFormV3 } from '@hooks';
import { CollectionModel, SongModel } from '@models';
import { type RouteProp, useRoute } from '@react-navigation/native';
import { Realm, useObject } from '@realm/react';
import type { CollectionNavigatorParams } from '@types';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { FAB, useTheme } from 'react-native-paper';
import { useFABActions } from './hooks';
import { Song } from './Song';

type CollectionDetailsRouteProp = RouteProp<CollectionNavigatorParams, 'CollectionDetails'>;

export const CollectionDetails = () => {
  const {
    params: { id, mode },
  } = useRoute<CollectionDetailsRouteProp>();

  const fabActions = useFABActions();
  const collection = useObject(CollectionModel, new Realm.BSON.ObjectId(id));
  const [isFabOpen, setIsFabOpen] = useState<boolean>(false);
  const { colors } = useTheme();

  const handleFabToggle = useCallback(() => setIsFabOpen(prevState => !prevState), []);

  const songs = useMemo(
    () => collection!.linkingObjects<SongModel>(SongModel.schema.name, 'collections'),
    [collection],
  );
  const s = usePluralFormV3(songs.length);

  return (
    <PageHeader subtitle={`${songs.length} item${s}`} title={`Collection: ${collection?.name}`}>
      <AudioPlayer />

      <List data={songs} isLoading={false} renderItem={({ item }) => <Song item={item} />} />

      {mode === 'picker' && <SongPicker collectionId={id} />}

      <FAB.Group
        actions={fabActions}
        backdropColor={colors.backdrop}
        icon="playlist-music"
        open={isFabOpen}
        onStateChange={handleFabToggle}
        style={styles.fab}
        variant="secondary"
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

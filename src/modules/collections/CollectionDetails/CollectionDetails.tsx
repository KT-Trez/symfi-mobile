import { AudioPlayer, List, PageHeader, SongPicker } from '@components';
import { usePluralFormV3, useSelected, useSongsManager } from '@hooks';
import { CollectionModel } from '@models';
import { type RouteProp, useRoute } from '@react-navigation/native';
import { Realm, useObject } from '@realm/react';
import type { CollectionNavigatorParams, SongType } from '@types';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { useFABActions } from './hooks';
import { Song } from './Song';

type CollectionDetailsRouteProp = RouteProp<CollectionNavigatorParams, 'CollectionDetails'>;

export const CollectionDetails = () => {
  const {
    params: { id, mode },
  } = useRoute<CollectionDetailsRouteProp>();

  const collectionId = useMemo(() => new Realm.BSON.ObjectId(id), [id]);

  const fabActions = useFABActions();
  const collection = useObject(CollectionModel, collectionId);
  const { isAnythingSelected, selected, toggleSelect } = useSelected<SongType>();
  const { searchPhrase, songs, setSearchPhrase } = useSongsManager(collectionId);
  const [isFabOpen, setIsFabOpen] = useState<boolean>(false);

  const handleFabToggle = useCallback(() => setIsFabOpen(prevState => !prevState), []);

  const s = usePluralFormV3(songs.length);

  return (
    <PageHeader subtitle={`${songs.length} item${s}`} title={`Collection: ${collection?.name}`}>
      <AudioPlayer />

      <List.Content
        data={songs}
        Header={<List.SearchBar searchPhrase={searchPhrase} setSearchPhrase={setSearchPhrase} />}
        isLoading={false}
        renderItem={({ item }) => (
          <Song
            isInSelectionMode={isAnythingSelected}
            isSelected={!!selected[item.id]}
            item={item}
            toggleSelect={toggleSelect}
          />
        )}
      />

      {mode === 'picker' && <SongPicker collectionId={id} />}

      <FAB.Group
        actions={fabActions}
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

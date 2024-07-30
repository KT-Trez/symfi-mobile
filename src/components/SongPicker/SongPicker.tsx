import { CollectionModel, SongModel } from '@models';
import { type NavigationProp, useNavigation } from '@react-navigation/native';
import { Realm, useRealm } from '@realm/react';
import { memo, useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Modal, Portal, Surface } from 'react-native-paper';
import { List } from '../List';
import { SongCard } from '../SongCard';

type SongPickerProps = {
  collectionId?: string;
  isVisible?: boolean;
};

export const SongPicker = memo(
  ({ collectionId, isVisible = true }: SongPickerProps) => {
    const { setParams } = useNavigation<NavigationProp<{ '*': { mode: undefined } }>>();
    const realm = useRealm();
    const [selectedSongs, setSelectedSongs] = useState<string[]>([]);

    const songs = useMemo(
      () =>
        realm
          .objects<SongModel>(SongModel.schema.name)
          .filtered(`NOT $0 IN collections.id`, new Realm.BSON.ObjectId(collectionId)),
      [collectionId, realm],
    );

    const handleDismiss = useCallback(() => {
      // find collection
      const id = new Realm.BSON.ObjectId(collectionId);
      const collection = realm.objectForPrimaryKey<CollectionModel>(CollectionModel.schema.name, id);
      if (!collection) {
        return console.error(collection); // todo: add toast
      }

      // find selected songs
      const filteredSongs = songs.filtered(`id IN $0`, selectedSongs);

      // add songs to the collection
      realm.write(() => {
        filteredSongs.forEach(song => {
          song.collections.push(collection);
        });
      });

      setParams({ mode: undefined });
    }, [collectionId, realm, selectedSongs, setParams, songs]);

    const handlePress = useCallback((id: string) => {
      setSelectedSongs(prevState => {
        if (prevState.includes(id)) {
          return prevState.filter(songId => songId !== id);
        }

        prevState.push(id);

        return prevState;
      });
    }, []);

    return (
      <Portal>
        <Modal onDismiss={handleDismiss} visible={isVisible}>
          <Surface style={[styles.view]}>
            <List.Content
              data={songs}
              renderItem={({ item }) => <SongCard bottomLabel="N/A" item={item} onPress={handlePress} />}
            />
          </Surface>
        </Modal>
      </Portal>
    );
  },
  (prevProps, nextProps) => prevProps.isVisible === nextProps.isVisible,
);

const styles = StyleSheet.create({
  view: {
    margin: 32,
  },
});

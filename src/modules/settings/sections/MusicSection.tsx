import { CollectionModel, SongModel } from '@models';
import { useQuery, useRealm } from '@realm/react';
import { documentDirectory, StorageAccessFramework, writeAsStringAsync } from 'expo-file-system';
import { useCallback, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { FlatSetting, Section } from '../components';
import { useResources } from '../hooks';

export const MusicSection = () => {
  const migratedCollections = useQuery(CollectionModel);
  const migratedSongs = useQuery(SongModel);
  const realm = useRealm();
  const { playlists, updateResources, songs } = useResources();
  const [isMigrating, setIsMigrating] = useState<boolean>(false);

  const isDisabled = migratedCollections.length >= playlists.length && migratedSongs.length >= songs.length;

  const migrateSchema = useCallback(async () => {
    setIsMigrating(true);

    try {
      const resources = await updateResources(playlists, songs);

      const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync(documentDirectory);
      if (!permissions.granted) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error('Failed to get directory permissions');
      }

      const backupCollectionsUri = await StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        'symfi.collections-backup.json',
        'application/json',
      );
      const backupSongsUri = await StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        'symfi.songs-backup.json',
        'application/json',
      );

      const migratedCollectionsUri = await StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        'symfi.collections-migration.json',
        'application/json',
      );
      const migratedSongsUri = await StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        'symfi.songs-migration.json',
        'application/json',
      );

      await Promise.all([
        writeAsStringAsync(backupCollectionsUri, JSON.stringify(playlists, null, 2)),
        writeAsStringAsync(backupSongsUri, JSON.stringify(songs, null, 2)),
        writeAsStringAsync(migratedCollectionsUri, JSON.stringify(Array.from(resources.migratedCollections), null, 2)),
        writeAsStringAsync(migratedSongsUri, JSON.stringify(Array.from(resources.migratedSongs), null, 2)),
      ]);

      realm.write(() => {
        for (const collection of Array.from(resources.migratedCollections)) {
          realm.create(CollectionModel.schema.name, collection, true);
        }
        for (const song of Array.from(resources.migratedSongs)) {
          realm.create(SongModel.schema.name, song, true);
          // createdSong.collections = resources.songCollectionsMap.get(song.id) || [];
        }
      });

      ToastAndroid.showWithGravity('Successfully migrated the schema.', ToastAndroid.SHORT, ToastAndroid.CENTER);
    } catch (err) {
      console.log(err);
      ToastAndroid.showWithGravity(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        `Failed to migrate the schema: ${err.message}`,
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
    } finally {
      setIsMigrating(false);
    }
  }, [playlists, realm, songs, updateResources]);

  return (
    <Section title="Music">
      <FlatSetting
        description="Migrate the schema of your Collections and Songs to the latest version."
        isDisabled={isDisabled}
        isLoading={isMigrating}
        onPress={migrateSchema}
        title="Migrate to v2.0.0"
      />
    </Section>
  );
};

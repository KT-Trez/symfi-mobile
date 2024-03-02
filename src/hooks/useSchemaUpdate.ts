import { Store } from '@/datastore/Store';
import { CollectionModel } from '@/models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useRealm } from '@realm/react';
import { useCallback, useEffect, useState } from 'react';
import { PlaylistMetadata, SavedSongMetadata } from '../../types/interfaces';
import SongPlayListData, { SongPlayListDataConstructor } from '../classes/SongPlayListData';
import config, { CURRENT_SCHEMA_VERSION } from '../config';
import PlayListController from '../datastore/PlayListController';
import SongsController from '../datastore/SongsController';

/**
 * Performs schema update for database models
 * @deprecated
 */
const useSchemaUpdate = async () => {
  const songs = (await SongsController.store.findAsync({})) as SavedSongMetadata[];

  if ((await AsyncStorage.getItem('version')) ?? '0' >= config.current_schema_version.toString()) return;

  for (const song of songs) {
    // schema v1 and older
    if (!song.musicly.version || song.musicly.version <= 1) {
      await SongsController.store.updateAsync(
        { id: song.id },
        {
          $set: {
            // @ts-ignore
            'musicly.file.downloadDate': song.createdAt,
            'musicly.flags.isDownloaded': true,
            'musicly.version': 1,
          },
        },
      );
    }

    // schema v2 and older
    if (song.musicly.version <= 2) {
      await SongsController.store.updateAsync(
        { id: song.id },
        {
          $set: {
            'musicly.playListsIDs': [],
          },
        },
      );

      for (const playlist of song.musicly.playlists) {
        const options: SongPlayListDataConstructor = {
          flags: {
            isFavourite: playlist.isFavourite,
          },
          order: playlist.order,
          playListID: playlist.id,
          songID: song.id,
        };

        const songPlayList = new SongPlayListData(options);
        await Store.songPlayLists.insertAsync(songPlayList);
        try {
          await SongsController.store.updateAsync(
            { id: song.id },
            {
              $push: {
                'musicly.playListsIDs': playlist.id,
              },
            },
          );
        } catch (err) {
          console.error(err);
        } finally {
          console.info(`${playlist.id} done`);
        }
      }

      await SongsController.store.updateAsync(
        { id: song.id },
        {
          $set: {
            'musicly.version': config.current_schema_version,
          },
          $unset: {
            'musicly.playlists': true,
          },
        },
      );
    }

    await AsyncStorage.setItem('version', config.current_schema_version.toString());
  }
};

/**
 * Performs schema update for database models
 */
export const useSchemaUpdate2 = () => {
  const collections = useQuery(CollectionModel);
  const realm = useRealm();
  const [version, setVersion] = useState<string | null>(null);

  const getMigratedSchemas = useCallback(async () => {
    const legacyCollections = await PlayListController.countAsync({ version: { $lt: CURRENT_SCHEMA_VERSION } });
    const legacySongs = await SongsController.countAsync({ 'musicly.version': { $lt: CURRENT_SCHEMA_VERSION } });

    console.log(
      `COLLECTIONS: new - ${collections.length}; old - ${legacyCollections} | SONGS: new - 0; old - ${legacySongs}`,
    );
  }, [collections.length]);

  const getSchemaVersion = useCallback(async () => {
    const version = await AsyncStorage.getItem('version');
    setVersion(version);
  }, []);

  const updateSchemas = useCallback(async () => {
    if (!version || version < '4') {
      console.info('updating schema to v4');

      const legacyCollections = (await PlayListController.store.findAsync({
        version: { $lt: CURRENT_SCHEMA_VERSION },
      })) as PlaylistMetadata[];

      realm.write(() => {
        for (const collection of legacyCollections) {
          if (realm.objects(CollectionModel.schema.name).filtered(`id == "${collection.id}"`).length > 0) {
            continue;
          }
          const newCollection = CollectionModel.generate({
            coverUri: collection.cover.uri,
            order: collection.order,
            title: collection.name,
            version: 4,
          });
          realm.create(CollectionModel.schema.name, newCollection);
        }
      });

      await AsyncStorage.setItem('version', '4');
      setVersion(await AsyncStorage.getItem('version'));
      // await PlayListController.store.removeAsync({ version: { $lt: CURRENT_SCHEMA_VERSION } });

      console.log('schema updated to v4');
    }
  }, [realm, version]);

  useEffect(() => {
    getSchemaVersion();
  }, [getSchemaVersion]);

  useEffect(() => {
    if (!version || version < CURRENT_SCHEMA_VERSION.toString()) {
      updateSchemas();
    }
  }, [updateSchemas, version]);

  return {
    getMigratedSchemas,
  };
};

export default useSchemaUpdate;

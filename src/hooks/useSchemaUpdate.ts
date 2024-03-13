import { CollectionModel, SongModel } from '@models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Realm, useQuery, useRealm } from '@realm/react';
import { CollectionId } from '@types';
import { useToast } from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { PlaylistMetadata, SavedSongMetadata } from '../../types/interfaces';
import SongPlayListData, { SongPlayListDataConstructor } from '../classes/SongPlayListData';
import config, { CURRENT_SCHEMA_VERSION } from '../config';
import PlayListController from '../datastore/PlayListController';
import SongsController from '../datastore/SongsController';
import { Store } from '../datastore/Store';

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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
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
  const songs = useQuery(SongModel);
  const realm = useRealm();
  const [version, setVersion] = useState<string | null>(null);
  const { show } = useToast();

  const getMigratedSchemas = useCallback(async () => {
    const legacyCollectionsCount = await PlayListController.countAsync({ version: { $lt: CURRENT_SCHEMA_VERSION } });
    const legacySongsCount = await SongsController.countAsync({ 'musicly.version': { $lt: CURRENT_SCHEMA_VERSION } });

    return {
      collections: {
        new: collections.length,
        old: legacyCollectionsCount,
      },
      songs: {
        new: songs.length,
        old: legacySongsCount,
      },
    };
  }, [collections.length, songs.length]);

  const getSchemaVersion = useCallback(async () => {
    const version = await AsyncStorage.getItem('version');
    setVersion(version);
  }, []);

  const updateSchemas = useCallback(async () => {
    console.info('updating schema to v4');

    const legacyCollections = (await PlayListController.store.findAsync({
      version: { $lt: CURRENT_SCHEMA_VERSION },
    })) as PlaylistMetadata[];

    const legacySongs = (await SongsController.store.findAsync({
      'musicly.version': { $lt: CURRENT_SCHEMA_VERSION },
    })) as SavedSongMetadata[];

    const mappedCollectionIds = legacyCollections.reduce<Record<string, CollectionId>>((acc, { id }) => {
      acc[id] = new Realm.BSON.ObjectId();

      return acc;
    }, {});

    const legacySongPlayLists = (await PlayListController.store.findAsync({
      songID: 'temp',
      version: { $lt: CURRENT_SCHEMA_VERSION },
    })) as SongPlayListData[];
    const collectionIds = legacySongPlayLists.map(playlist => playlist.playListID);

    await realm.write(async () => {
      for (const song of legacySongs) {
        const cover = song.musicly.cover.uri
          ? {
              name: song.musicly.cover.name,
              uri: song.musicly.cover.uri,
            }
          : undefined;

        const file = song.musicly.file.path
          ? {
              downloadedAt: song.musicly.file.downloadDate,
              id: song.musicly.file.id!,
              uri: song.musicly.file.path!,
              size: song.musicly.file.size!,
            }
          : undefined;

        const newSong = SongModel.generate({
          channel: {
            name: song.channel.name,
            url: song.channel.url,
          },
          collections: collectionIds.map(id => mappedCollectionIds[id]),
          cover,
          duration: {
            label: song.metadata.duration.simple_text,
            seconds: song.metadata.duration.seconds,
          },
          file,
          id: song.id,
          name: song.title,
          published: song.metadata.published,
          thumbnail: song.metadata.thumbnails[0].url,
          views: {
            count: Number(song.metadata.view_count),
            label: song.metadata.short_view_count_text.simple_text,
          },
        });
        realm.create(SongModel.schema.name, newSong);
      }
    });

    realm.write(() => {
      for (const collection of legacyCollections) {
        const newCollection = CollectionModel.generate({
          coverUri: collection.cover.uri,
          order: collection.order,
          name: collection.name,
        });
        realm.create(CollectionModel.schema.name, newCollection);
      }
    });

    await AsyncStorage.setItem('version', '4');
    setVersion(await AsyncStorage.getItem('version'));
    // await PlayListController.store.removeAsync({ version: { $lt: CURRENT_SCHEMA_VERSION } });

    console.log('schema updated to v4');
  }, [realm]);

  useEffect(() => {
    getSchemaVersion();
  }, [getSchemaVersion]);

  useEffect(() => {
    getMigratedSchemas().then(({ collections, songs }) => {
      console.log(collections, songs);
      const hasNotMigratedCollections = collections.new < collections.old && collections.old !== 0;
      const hasNotMigratedSongs = songs.new < songs.old && songs.old !== 0;

      show({
        description: `${hasNotMigratedCollections} n${collections.new}o${collections.old} ${hasNotMigratedSongs} n${songs.new}o${songs.old}`,
        title: 'Success',
      });

      if (hasNotMigratedCollections || hasNotMigratedSongs) {
        updateSchemas();
      }
    });
  }, [getMigratedSchemas, updateSchemas, version]);

  return {
    getMigratedSchemas,
  };
};

export default useSchemaUpdate;

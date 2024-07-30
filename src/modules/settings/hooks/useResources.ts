import { Realm } from '@realm/react';
import type { CollectionType, SongType } from '@types';
import { useCallback, useEffect, useState } from 'react';
import type { PlaylistData, PlaylistMetadata, SavedSongMetadata } from '../../../../types/interfaces';
import PlayListController from '../../../datastore/PlayListController';
import SongsController from '../../../datastore/SongsController';
import { Store } from '../../../datastore/Store';

export const useResources = () => {
  const [playlists, setPlaylists] = useState<PlaylistMetadata[]>([]);
  const [songs, setSongs] = useState<SavedSongMetadata[]>([]);

  const fetchResources = useCallback(async () => {
    setPlaylists((await PlayListController.store.findAsync({})) as PlaylistMetadata[]);

    const songs = (await SongsController.store.findAsync({})) as SavedSongMetadata[];
    for (const song of songs) {
      song.musicly.playlists.push(...((await Store.songPlayLists.findAsync({ songID: song.id })) as PlaylistData[]));
    }

    setSongs(songs);
  }, []);

  const updateResources = useCallback(async (playlists: PlaylistMetadata[], songs: SavedSongMetadata[]) => {
    const collectionsMap = new Map<string, CollectionType>();

    for (const playlist of playlists) {
      const collection: CollectionType = {
        coverUri: playlist.cover.uri,
        id: new Realm.BSON.ObjectId(),
        name: playlist.name,
        order: 0,
      };

      collectionsMap.set(playlist.id, collection);
    }

    const songsMap = new Map<string, SongType>();
    const songCollectionsMap = new Map<string, CollectionType[]>();

    for (const song of songs) {
      const updatedSong: SongType = {
        channel: {
          name: song.channel.name,
          url: song.channel.url,
        },
        duration: {
          label: song.metadata.duration.simple_text,
          seconds: song.metadata.duration.seconds,
        },
        id: song.id,
        name: song.title,
        published: song.metadata.published,
        thumbnail: song.metadata.thumbnails.at(0)?.url || 'https://placehold.co/1920x1080',
        views: {
          count: Number.isNaN(Number(song.metadata.view_count.toLowerCase())) ? 0 : Number(song.metadata.view_count),
          label: song.metadata.short_view_count_text.simple_text,
        },
        cover: song.musicly.cover.uri,
        file: {
          modifiedDate: new Date(song.musicly.file.downloadDate),
          uri: song.musicly.file.path!,
          size: song.musicly.file.size!,
        },
      };

      const collections = song.musicly.playlists.map(playlist => collectionsMap.get(playlist.id)!);
      songCollectionsMap.set(song.id, collections);

      songsMap.set(song.id, updatedSong);
    }

    return {
      migratedCollections: collectionsMap.values(),
      migratedSongs: songsMap.values(),
      songCollectionsMap,
    };
  }, []);

  useEffect(() => {
    fetchResources().then(() => console.info('Resources fetched.'));
  }, [fetchResources]);

  return {
    playlists,
    songs,
    updateResources,
  };
};

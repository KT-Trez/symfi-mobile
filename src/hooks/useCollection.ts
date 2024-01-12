import { useCallback, useEffect, useState } from 'react';
import type { CollectionId, CollectionType } from 'types';
import { Musicly } from '../../types';
import PlayListController from '../datastore/PlayListController';
import { Store } from '../datastore/Store';

export const useCollection = (id: CollectionId) => {
  const [collection, setCollection] = useState<null | CollectionType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchCollection = useCallback(
    async (updateLoadingFlag = false) => {
      if (updateLoadingFlag) {
        setIsLoading(true);
      }
      const fetchedCollection = (await PlayListController.store.findOneAsync({ id })) as CollectionType;
      const songs = (await Store.songPlayLists.findAsync({ playListID: id })) as Musicly.Data.SongPlayList[];

      if (Array.isArray(fetchedCollection.songs)) {
        fetchedCollection.songs = fetchedCollection.songs.concat(songs.map(({ songID }) => songID));
      } else {
        fetchedCollection.songs = songs.map(({ songID }) => songID);
      }

      setCollection(fetchedCollection);
      if (updateLoadingFlag) {
        setIsLoading(false);
      }
    },
    [id],
  );

  const update = useCallback(
    async (updateQuery: Partial<CollectionType>) => {
      await PlayListController.store.updateAsync({ id }, { $set: updateQuery });
      await fetchCollection();
    },
    [fetchCollection, id],
  );

  useEffect(() => {
    fetchCollection(true);
  }, [fetchCollection]);

  return {
    collection,
    isLoading,
    update,
  };
};

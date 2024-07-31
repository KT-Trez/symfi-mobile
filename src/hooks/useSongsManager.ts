import { SongModel } from '@models';
import { useQuery, useRealm } from '@realm/react';
import type { CollectionId } from '@types';
import { useCallback, useState } from 'react';

export const useSongsManager = (collectionId: CollectionId) => {
  const realm = useRealm();
  const [searchPhrase, setSearchPhrase] = useState<string>('');

  const deleteSong = useCallback(
    (song: SongModel) => {
      realm.write(() => {
        realm.delete(song);
      });
    },
    [realm],
  );

  const songs = useQuery(
    SongModel,
    songs => songs.filtered('collections.id == $0 AND name CONTAINS[c] $1', collectionId, searchPhrase).sorted('name'),
    [collectionId, searchPhrase],
  );

  return {
    deleteSong,
    searchPhrase,
    songs,
    setSearchPhrase,
  };
};

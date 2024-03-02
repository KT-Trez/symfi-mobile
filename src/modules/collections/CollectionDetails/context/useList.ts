import type { ListProviderProps } from '@hooks';
import type { SongListItem } from '@types';
import { useContext } from 'react';
import { CollectionDetailsContext } from './CollectionDetailsContext';

export const useList = (): ListProviderProps<SongListItem> => {
  const actions = useContext(CollectionDetailsContext);
  if (!actions) {
    throw Error('Missing provider. Hook useList must be used inside ListProviderProps<T>.');
  }

  return actions;
};

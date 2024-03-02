import type { ListProviderProps } from '@hooks';
import { type CollectionListItem } from '@types';
import { useContext } from 'react';
import { CollectionListContext } from './CollectionListContext';

export const useList = (): ListProviderProps<CollectionListItem> => {
  const actions = useContext(CollectionListContext);
  if (!actions) {
    throw Error('Missing provider. Hook useList must be used inside ListProviderProps<T>.');
  }

  return actions;
};

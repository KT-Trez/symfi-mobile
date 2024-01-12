import { useContext } from 'react';
import { BaseListItem } from '../../types';
import { ListContext, ListContextProps } from './context';

export const useList = <T extends BaseListItem>(): ListContextProps<T> => {
  const actions = useContext(ListContext);
  if (!actions) {
    throw Error('Missing provider. Hook useList must be used inside ListProvider.');
  }

  return actions as ListContextProps<T>;
};

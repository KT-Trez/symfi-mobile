import { useContext } from 'react';
import { ListContext } from '../ListProvider';

export const useList = () => {
  const actions = useContext(ListContext);
  if (!actions) {
    throw Error('Missing provider. Hook useList must be used inside ListProvider.');
  }

  return actions;
};

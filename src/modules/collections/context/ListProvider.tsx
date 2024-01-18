import { createContext, ReactNode } from 'react';
import type { CollectionType } from 'types';
import { UseListProviderActions, useListProviderActions } from '../../../hooks';

type ListProviderProps = {
  children?: ReactNode;
  onFetch: () => Promise<CollectionType[]>;
};

export const ListContext = createContext<undefined | UseListProviderActions<CollectionType>>(undefined);

export const ListProvider = ({ children, onFetch }: ListProviderProps) => {
  const value = useListProviderActions<CollectionType>(onFetch);

  return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
};

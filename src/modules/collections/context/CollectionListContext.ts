import { ListProviderProps } from '@hooks';
import type { CollectionListItem } from '@types';
import { createContext } from 'react';

export const CollectionListContext = createContext<ListProviderProps<CollectionListItem> | undefined>(undefined);

import type { ListProviderProps } from '@hooks';
import type { BaseItem, SongType } from '@types';
import { createContext } from 'react';

export const CollectionDetailsContext = createContext<ListProviderProps<SongType & BaseItem> | undefined>(undefined);

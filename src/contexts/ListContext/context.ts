import { createContext } from 'react';
import { BaseListItem } from '../../types';

export type ListContextProps<T extends BaseListItem> = {
  displayedData: T[];
  isLoading: boolean;
  reload: () => void;
  selectAllListItems: () => void;
  selectListItem: (item: T) => void;
  selectedData: Map<string, T>;
  unselectAllListItems: () => void;
  unselectListItem: (item: T) => void;
};

// todo: find a way to use generic parameter in createContext
export const ListContext = createContext<undefined | ListContextProps<BaseListItem>>(undefined);

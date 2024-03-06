import { Realm } from '@realm/react';
import type { BaseItem } from '@types';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type ListProviderProps<T extends BaseItem> = {
  isInSelectionMode: boolean;
  items: T[];
  selectAllItems: () => void;
  selectItem: (item: T) => void;
  unselectAllItems: () => void;
  unselectItem: (item: T) => void;
};

export const useListContextProps = <T extends BaseItem, TModel>(items: Realm.Results<TModel>): ListProviderProps<T> => {
  const [isInSelectionMode, setIsInSelectionMode] = useState<boolean>(false);
  const [visibleItems, setVisibleItems] = useState<T[]>([]);

  const selectAllItems = useCallback(() => {
    setIsInSelectionMode(true);
    setVisibleItems(prevState => prevState.map(item => ({ ...item, isSelected: true })));
  }, []);

  const selectItem = useCallback((itemT: T) => {
    setIsInSelectionMode(true);
    setVisibleItems(prevState => prevState.map(item => (item.id === itemT.id ? { ...item, isSelected: true } : item)));
  }, []);

  const unselectAllItems = useCallback(() => {
    setIsInSelectionMode(false);
    setVisibleItems(prevState => prevState.map(item => ({ ...item, isSelected: false })));
  }, []);

  const unselectItem = useCallback((itemT: T) => {
    let isAnyItemSelected = false;
    setVisibleItems(prevState =>
      prevState.map(item => {
        const isItemSelected = item.id === itemT.id ? false : item.isSelected;
        isAnyItemSelected = isAnyItemSelected || isItemSelected;

        return item.id === itemT.id ? { ...item, isSelected: false } : item;
      }),
    );
    setIsInSelectionMode(isAnyItemSelected);
  }, []);

  useEffect(() => {
    setIsInSelectionMode(false);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    setVisibleItems(items.map(item => ({ ...item, isSelected: false })));
  }, [items]);

  return useMemo(
    () => ({
      isInSelectionMode,
      items: visibleItems,
      selectAllItems,
      selectItem,
      unselectAllItems,
      unselectItem,
    }),
    [isInSelectionMode, selectAllItems, selectItem, unselectAllItems, unselectItem, visibleItems],
  );
};

import { useCallback, useEffect, useState } from 'react';
import { BaseListItem } from '../types';

export type UseListProviderActions<T extends BaseListItem> = {
  displayedData: T[];
  isLoading: boolean;
  reload: () => Promise<void>;
  selectAllListItems: () => void;
  selectListItem: (item: T) => void;
  selectedData: Map<string, T>;
  unselectAllListItems: () => void;
  unselectListItem: (item: T) => void;
};

export const useListProviderActions = <T extends BaseListItem>(
  onFetch: () => Promise<T[]>,
): UseListProviderActions<T> => {
  const [data, setData] = useState<T[]>([]);
  const [displayedData, setDisplayedData] = useState<T[]>([]);
  const [selectedData, setSelectedData] = useState<Map<string, T>>(new Map());

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    const fetched = await onFetch();
    setData(fetched);
    setIsLoading(false);
  }, [onFetch]);

  const selectAllListItems = useCallback(
    () =>
      setSelectedData(
        displayedData.reduce<Map<string, T>>((acc, currentItem) => acc.set(currentItem.id, currentItem), new Map()),
      ),
    [displayedData],
  );

  const selectListItem = useCallback(
    (item: T) => setSelectedData(prevState => new Map(prevState).set(item.id, item)),
    [],
  );

  const unselectAllListItems = () => setSelectedData(new Map());

  const unselectListItem = useCallback(
    ({ id }: T) =>
      setSelectedData(prevState => {
        const stateCopy = new Map(prevState);
        stateCopy.delete(id);
        return stateCopy;
      }),
    [],
  );

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    setDisplayedData(data);
  }, [data]);

  return {
    displayedData,
    isLoading,
    reload: fetch,
    selectAllListItems,
    selectListItem,
    selectedData,
    unselectAllListItems,
    unselectListItem,
  };
};

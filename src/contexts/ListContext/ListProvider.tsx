import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { BaseListItem } from '../../types';
import { ListContext, ListContextProps } from './context';

type ListProviderProps<T extends BaseListItem> = {
  children?: ReactNode;
  onFetch: () => Promise<T[]>;
};

export const ListProvider = <T extends BaseListItem>({ children, onFetch }: ListProviderProps<T>) => {
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

  const providerProps: ListContextProps<T> = useMemo(
    () => ({
      displayedData,
      isLoading,
      reload: fetch,
      selectAllListItems,
      selectListItem,
      selectedData,
      unselectAllListItems,
      unselectListItem,
    }),
    [displayedData, isLoading, fetch, selectAllListItems, selectListItem, selectedData, unselectListItem],
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return <ListContext.Provider value={providerProps}>{children}</ListContext.Provider>;
};

import { useList } from '@/modules/collections/context';
import type { CollectionId, CollectionNavigatorProps } from '@/types';
import { Action } from '@components';
import { CollectionModel } from '@models';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useRealm } from '@realm/react';
import { useCallback, useMemo } from 'react';

export const usePageHeaderActions = (): Action[] => {
  const { isInSelectionMode, items, unselectAllItems } = useList();
  const { navigate } = useNavigation<CollectionNavigatorProps>();
  const collections = useQuery(CollectionModel);
  const realm = useRealm();

  const id = useMemo(() => {
    if (!isInSelectionMode) {
      return '';
    }

    return items.find(item => item.isSelected)?.id.toHexString() || '';
  }, [isInSelectionMode, items]);

  const deleteCollection = useCallback(() => {
    const selectedIds = items.reduce<CollectionId[]>((acc, item) => {
      if (item.isSelected) acc.push(item.id);

      return acc;
    }, []);
    const filteredCollections = collections.filtered('id IN $0', selectedIds);

    realm.write(() => {
      realm.delete(filteredCollections);
    });
  }, [collections, items, realm]);

  return useMemo<Action[]>(
    () => [
      {
        color: 'error.700',
        icon: 'delete',
        onPress: deleteCollection,
      },
      {
        icon: 'pencil',
        onPress: () => navigate('CollectionEdit', { id }),
      },
      // {
      //   icon: 'cancel',
      //   onPress: unselectAllItems,
      // },
    ],
    [id, isInSelectionMode, navigate],
  );
};

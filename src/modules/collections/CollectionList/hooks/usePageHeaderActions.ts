import { ActionType, useConfirmDialog } from '@components';
import { CollectionModel } from '@models';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useRealm } from '@realm/react';
import type { CollectionId, CollectionNavigatorProps } from '@types';
import { useCallback, useMemo } from 'react';
import { useTheme } from 'react-native-paper';
import { useList } from '../../context';

export const usePageHeaderActions = (): ActionType[] => {
  const { close, open } = useConfirmDialog();
  const { isInSelectionMode, items } = useList();
  const { navigate } = useNavigation<CollectionNavigatorProps>();
  const collections = useQuery(CollectionModel);
  const realm = useRealm();
  const { colors } = useTheme();

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

    const s = filteredCollections.length !== 1 ? 's' : '';

    open({
      items: filteredCollections.map(collection => collection.name),
      itemText: 'collection',
      onConfirm: () => {
        close();
        realm.write(() => {
          realm.delete(filteredCollections);
        });
      },
      title: `Delete collection${s}`,
    });
  }, [close, collections, items, open, realm]);

  return useMemo<ActionType[]>(
    () => [
      {
        color: colors.error,
        icon: 'delete',
        onPress: deleteCollection,
      },
      {
        icon: 'pencil',
        onPress: () => navigate('CollectionEdit', { id }),
      },
    ],
    [colors.error, deleteCollection, id, navigate],
  );
};

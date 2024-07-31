import { ActionType, useConfirmDialog } from '@components';
import { CollectionModel } from '@models';
import { useRealm } from '@realm/react';
import { useCallback, useMemo } from 'react';
import { useTheme } from 'react-native-paper';

type UsePageHeaderActionsArgs = {
  selected: Record<string, CollectionModel>;
  unselectAll: () => void;
};

export const usePageHeaderActions = ({ selected, unselectAll }: UsePageHeaderActionsArgs): ActionType[] => {
  const { close, open } = useConfirmDialog();
  const realm = useRealm();
  const { colors } = useTheme();

  const handleDelete = useCallback(() => {
    open({
      items: Object.values(selected).map(collection => collection.name),
      itemText: 'collection',
      onConfirm: () => {
        realm.write(() => {
          for (const collectionId in selected) {
            realm.delete(selected[collectionId]);
          }
        });
        close();
        unselectAll();
      },
      title: 'Delete',
    });
  }, [close, open, realm, selected, unselectAll]);

  return useMemo<ActionType[]>(
    () => [
      {
        color: colors.error,
        icon: 'delete',
        onPress: handleDelete,
      },
      {
        icon: 'close',
        onPress: unselectAll,
      },
    ],
    [colors.error, handleDelete, unselectAll],
  );
};

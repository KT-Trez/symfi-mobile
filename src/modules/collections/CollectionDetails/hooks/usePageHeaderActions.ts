import { ActionType, useConfirmDialog } from '@components';
import { SongModel } from '@models';
import { useNavigation } from '@react-navigation/native';
import { useRealm } from '@realm/react';
import type { CollectionNavigatorProps } from '@types';
import { useCallback, useMemo } from 'react';
import { useTheme } from 'react-native-paper';

type UsePageHeaderActionsArgs = {
  collectionId: string;
  selected: Record<string, SongModel>;
  unselectAll: () => void;
};

export const usePageHeaderActions = ({
  collectionId,
  selected,
  unselectAll,
}: UsePageHeaderActionsArgs): ActionType[] => {
  const { close, open } = useConfirmDialog();
  const { navigate } = useNavigation<CollectionNavigatorProps>();
  const realm = useRealm();
  // todo: add delete option
  const { colors } = useTheme();

  const selectedIds = useMemo<string[]>(() => Object.keys(selected), [selected]);

  const handleDelete = useCallback(() => {
    open({
      items: Object.values(selected).map(song => song.name),
      itemText: 'song',
      onConfirm: () => {
        realm.write(() => {
          for (const songId in selected) {
            realm.delete(selected[songId]);
          }
        });
        close();
        unselectAll();
      },
      title: 'Delete',
    });
  }, [close, open, realm, selected, unselectAll]);

  const handleEdit = useCallback(() => {
    if (selectedIds.length !== 1) {
      return;
    }

    const songId = selectedIds.at(0)!;

    navigate('SongEditForm', { collectionId, songId });
    unselectAll();
  }, [collectionId, navigate, selectedIds, unselectAll]);

  return useMemo(
    () => [
      // {
      //   color: colors.error,
      //   icon: 'delete',
      //   onPress: handleDelete,
      // },
      {
        isHidden: selectedIds.length !== 1,
        icon: 'pencil',
        onPress: handleEdit,
      },
      {
        icon: 'close',
        onPress: unselectAll,
      },
    ],
    [handleEdit, selectedIds.length, unselectAll],
  );
};

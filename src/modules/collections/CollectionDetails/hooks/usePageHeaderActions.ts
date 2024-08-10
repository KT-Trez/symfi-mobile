import { ActionType, useConfirmDialog } from '@components';
import { SongModel } from '@models';
import { useRealm } from '@realm/react';
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
  const realm = useRealm();
  // todo: add delete option
  const { colors } = useTheme();

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

  const handleRemove = useCallback(() => {
    realm.write(() => {
      for (const songId in selected) {
        const song = selected[songId];
        song.collections = song.collections.filter(({ id }) => id.toHexString() !== collectionId);
      }
    });
    unselectAll();
  }, [collectionId, realm, selected, unselectAll]);

  return useMemo(
    () => [
      // {
      //   color: colors.error,
      //   icon: 'delete',
      //   onPress: handleDelete,
      // },
      {
        icon: 'playlist-minus',
        onPress: handleRemove,
      },
      {
        icon: 'close',
        onPress: unselectAll,
      },
    ],
    [handleRemove, unselectAll],
  );
};

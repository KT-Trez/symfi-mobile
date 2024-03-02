import { useList } from '@/modules/collections/context';
import type { CollectionNavigatorProps } from '@/types';
import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';
import { Action } from '../../../../components';

export const usePageHeaderActions = (): Action[] => {
  const { isInSelectionMode, items } = useList();
  const { navigate } = useNavigation<CollectionNavigatorProps>();

  const id = useMemo(() => {
    if (!isInSelectionMode) {
      return '';
    }

    return items.find(item => item.isSelected)?.id.toHexString() || '';
  }, [isInSelectionMode, items]);

  return useMemo(
    () => [
      {
        icon: 'pencil',
        isHidden: !isInSelectionMode,
        onPress: () => navigate('CollectionEdit', { id }),
      },
    ],
    [id, isInSelectionMode, navigate],
  );
};

import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';
import { Action } from '../../../../components';
import type { CollectionNavigatorProps } from 'types';
import { useList } from '../../context';

export const usePageHeaderActions = (): Action[] => {
  const { selectedData } = useList();
  const { navigate } = useNavigation<CollectionNavigatorProps>();

  return useMemo(
    () => [
      {
        icon: 'pencil',
        isHidden: selectedData.size !== 1,
        onPress: () => navigate('CollectionEdit', { id: selectedData.keys().next().value }),
      },
    ],
    [navigate, selectedData],
  );
};

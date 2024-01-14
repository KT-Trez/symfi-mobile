import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';
import { Action } from '../../../../components';

export const usePageHeaderActions = (): Action[] => {
  const navigate = useNavigation();

  return useMemo(
    () => [
      {
        icon: 'dots-vertical',
        isMenu: true,
        options: [
          {
            name: 'Add Song',
            onPress: () => console.log('Edit'),
          },
        ],
      },
    ],
    [],
  );
};

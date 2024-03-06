import { ActionType } from '@components';
import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';

export const usePageHeaderActions = (): ActionType[] => {
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

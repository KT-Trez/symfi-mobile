import { useNavigation } from '@react-navigation/native';
import type { CollectionNavigatorProps, FABAction } from '@types';
import { useMemo } from 'react';

export const useFABActions = (): FABAction[] => {
  const { navigate, setParams } = useNavigation<CollectionNavigatorProps>();

  return useMemo<FABAction[]>(
    () => [
      {
        icon: 'download',
        label: 'Download',
        onPress: () => navigate('SongsSearch'),
      },
      {
        icon: 'playlist-plus',
        label: 'Add to playlist',
        onPress: () => setParams({ mode: 'picker' }),
      },
    ],
    [navigate, setParams],
  );
};

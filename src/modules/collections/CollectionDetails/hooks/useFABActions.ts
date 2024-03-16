import { useNavigation } from '@react-navigation/native';
import type { CollectionNavigatorProps, FABAction } from '@types';
import { useMemo } from 'react';
import { useTheme } from 'react-native-paper';

export const useFABActions = (): FABAction[] => {
  const { navigate, setParams } = useNavigation<CollectionNavigatorProps>();
  const { colors } = useTheme();

  return useMemo<FABAction[]>(
    () => [
      {
        color: colors.onSecondary,
        icon: 'download',
        label: 'Download',
        onPress: () => navigate('SongsSearch'),
        style: { backgroundColor: colors.secondary },
      },
      {
        color: colors.onSecondary,
        icon: 'playlist-plus',
        label: 'Add to playlist',
        onPress: () => setParams({ mode: 'picker' }),
        style: { backgroundColor: colors.secondary },
      },
    ],
    [colors.onSecondary, colors.secondary, navigate, setParams],
  );
};

import { DefaultTheme, Theme } from '@react-navigation/native';
import { useMemo } from 'react';
import { useTheme } from 'react-native-paper';

export const useCustomTheme = () => {
  const { colors } = useTheme();

  const customTheme: Theme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        background: colors.background,
        border: colors.onPrimary,
        card: colors.surface,
        notification: colors.surface,
        primary: colors.onPrimary,
        text: colors.onPrimary,
      },
      dark: false,
    }),
    [colors.background, colors.onPrimary, colors.surface],
  );

  return { customTheme };
};

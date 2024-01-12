import { DefaultTheme, Theme } from '@react-navigation/native';
import { useColorMode, useTheme } from 'native-base';
import { useMemo } from 'react';

export const useCustomTheme = () => {
  const { colorMode } = useColorMode();
  const { colors } = useTheme();

  const customTheme: Theme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        background: colors.light['50'],
        border: colors.light['500'],
        card: colors.primary['900'],
        notification: colors.light['500'],
        primary: colors.text['50'],
        text: colors.text['50'],
      },
      dark: colorMode === 'dark',
    }),
    [colorMode, colors.light, colors.primary, colors.text],
  );

  return { customTheme };
};

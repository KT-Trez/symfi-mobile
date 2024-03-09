import { DefaultTheme } from 'react-native-paper';
import type { ThemeProp } from 'react-native-paper/src/types';

export const theme: ThemeProp = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F6FAFD',
    onBackground: '#171C1F',
    primary: '#106682',
    inversePrimary: '#8AD0EF',
    onPrimary: '#FFFFFF',
    primaryContainer: '#BDE9FF',
    onPrimaryContainer: '#001F2A',
    secondary: '#4D616B',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#D0E6F2',
    onSecondaryContainer: '#081E27',
    tertiary: '#5D5B7D',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#E3DFFF',
    onTertiaryContainer: '#191836',
    surface: '#F6FAFD',
    inverseSurface: '#2C3134',
    inverseOnSurface: '#EDF1F5',
    onSurface: '#171C1F',
    surfaceVariant: '#DCE4E9',
    onSurfaceVariant: '#40484C',
    surfaceDisabled: '#D6DBDE',
    onSurfaceDisabled: '#F6FAFD',
    error: '#BA1A1A',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',
    // backdrop: string;
    outline: '#70787D',
    outlineVariant: '#C0C8CD',
    shadow: '#000000',
    scrim: '#000000',
    elevation: {
      level0: 'transparent',
      // Note: Color values with transparency cause RN to transfer shadows to children nodes
      // instead of View component in Surface. Providing solid background fixes the issue.
      // Opaque color values generated with `palette.primary99` used as background
      level1: '#FFFFFF', // palette.primary40, alpha 0.05
      level2: '#F0F4F8', // palette.primary40, alpha 0.08
      level3: '#EAEEF2', // palette.primary40, alpha 0.11
      level4: '#E4E9EC', // palette.primary40, alpha 0.12
      level5: '#DFE3E7', // palette.primary40, alpha 0.14
    },
  },
};

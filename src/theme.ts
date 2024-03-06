import { DefaultTheme } from 'react-native-paper';
import type { ThemeProp } from 'react-native-paper/src/types';

export const theme: ThemeProp = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff',
    onBackground: '#000',
    primary: '#a9ccd5',
    // inversePrimary: string;
    onPrimary: '#fff',
    primaryContainer: '#e0f5fc',
    onPrimaryContainer: '#000',
    secondary: '#d5b2a9',
    onSecondary: '#fff',
    // secondaryContainer: string;
    // onSecondaryContainer: string;
    // tertiary: string;
    // onTertiary: string;
    // tertiaryContainer: string;
    // onTertiaryContainer: string;
    surface: '#5b93a0',
    // inverseSurface: string;
    // inverseOnSurface: string;
    onSurface: '#fff',
    surfaceVariant: '#fff',
    onSurfaceVariant: '#000',
    // surfaceDisabled: string;
    // onSurfaceDisabled: string;
    error: '#d5a9cc',
    onError: '#000',
    // errorContainer: string;
    // onErrorContainer: string;
    // backdrop: string;
    // outline: string;
    // outlineVariant: string;
    // shadow: string;
    // scrim: string;
    elevation: {
      level0: 'transparent',
      // Note: Color values with transparency cause RN to transfer shadows to children nodes
      // instead of View component in Surface. Providing solid background fixes the issue.
      // Opaque color values generated with `palette.primary99` used as background
      level1: '#fbfcfd', // palette.primary40, alpha 0.05
      level2: '#f8fbfc', // palette.primary40, alpha 0.08
      level3: '#f6f9fa', // palette.primary40, alpha 0.11
      level4: '#f5f9fa', // palette.primary40, alpha 0.12
      level5: '#f1f6f7', // palette.primary40, alpha 0.14
    },
  },
};

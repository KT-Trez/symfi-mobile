import { DefaultTheme } from 'react-native-paper';
import type { ThemeProp } from 'react-native-paper/src/types';

export const theme: ThemeProp = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff',
    onBackground: '#000',
    primary: '#A9CCD5',
    onPrimary: '#000',
    primaryContainer: '#5b93a0',
    onPrimaryContainer: '#fff',
    inversePrimary: '#406d78',
    secondary: '#ffebe2',
    onSecondary: '#000',
    secondaryContainer: '#d5b2a9',
    onSecondaryContainer: '#000',
    // tertiary: '#5D5B7D',
    // onTertiary: '#FFFFFF',
    // tertiaryContainer: '#E3DFFF',
    // onTertiaryContainer: '#191836',
    surface: '#5b93a0',
    onSurface: '#fff',
    // surfaceVariant: '#DCE4E9',
    // onSurfaceVariant: '#40484C',
    // inverseSurface: '#2C3134',
    // inverseOnSurface: '#EDF1F5',
    surfaceDisabled: '#07405f',
    onSurfaceDisabled: '#cccccc',
    error: '#b00020',
    onError: '#fff',
    // errorContainer: '#FFDAD6',
    // onErrorContainer: '#410002',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    // outline: '#70787D',
    // outlineVariant: '#C0C8CD',
    // shadow: '#000000',
    // scrim: '#000000',
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
  dark: true,
};

// background, surface #fff
// error #b00020

// primary #00d35f (appbar, fab)
// primaryVariant #00bf75 (statusbar)

// secondary #d30074
// secondaryVariant #970067

// secondary:
// * fab
// * controls, ex.: sliders, switches
// * highlighting text
// * progress bars
// * links, headlines

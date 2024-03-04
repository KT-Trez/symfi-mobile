import { DefaultTheme } from '@react-navigation/native';
import type { ThemeProp } from 'react-native-paper/src/types';

export const theme: ThemeProp = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#A9CCD5',
    primaryContainer: '#56B8D1',
    secondary: '#FE8706',
    // secondary: string;
    // secondaryContainer: string;
    // tertiary: string;
    // tertiaryContainer: string;
    surface: '#1CA8CC',
    // surfaceVariant: string;
    // surfaceDisabled: string;
    // background: string;
    // error: string;
    // errorContainer: string;
    // onPrimary: string;
    onPrimaryContainer: '#A9CCD5',
    // onSecondary: string;
    // onSecondaryContainer: string;
    // onTertiary: string;
    // onTertiaryContainer: string;
    onSurface: '#A9CCD5',
    // onSurfaceVariant: string;
    // onSurfaceDisabled: string;
    // onError: string;
    // onErrorContainer: string;
    // onBackground: string;
    // outline: string;
    // outlineVariant: string;
    // inverseSurface: string;
    // inverseOnSurface: string;
    // inversePrimary: string;
    // shadow: string;
    // scrim: string;
    // backdrop: string;
    // elevation: MD3ElevationColors;
  },
};

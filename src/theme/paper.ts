// src/theme/paper.ts
import { MD3LightTheme as DefaultTheme, configureFonts, type MD3Theme } from 'react-native-paper';

const fontConfig = {
  config: {
    // Keep defaults; customize if you use a custom font family
    fontFamily: undefined,
  },
} as const;

export const paperTheme: MD3Theme = {
  ...DefaultTheme,
  // MD3 color scheme – tweak to match your brand/site
  colors: {
    ...DefaultTheme.colors,
    primary: '#2e7d32',
    secondary: '#4CAF50',
    tertiary: '#006A6A',
    surface: '#FFFFFF',
    surfaceVariant: '#E7E9EC',
    background: '#FAFAFA',
    error: '#B3261E',
    onPrimary: '#FFFFFF',
    onSurface: '#1B1B1F',
    onSurfaceVariant: '#44474F',
    outline: '#79747E',
  },
  fonts: configureFonts({ config: fontConfig.config }),
  roundness: 4,
};

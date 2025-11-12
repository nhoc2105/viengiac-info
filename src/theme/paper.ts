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
    primary: '#904a44',
    primaryContainer: '#ffdad6',
    secondary: '#775653',
    secondaryContainer: '#ffdad6',
    tertiary: '#715b2e',
    tertiaryContainer: '#fedfa6',
    surface: '#ffffff',
    surfaceVariant: '#fff8f7',
    background: '#fff8f7',
    error: '#ba1a1a',
    errorContainer: '#ffdad6',
    onPrimary: '#ffffff',
    onPrimaryContainer: '#73332e',
    onSecondary: '#ffffff',
    onSecondaryContainer: '#5d3f3c',
    onTertiary: '#ffffff',
    onTertiaryContainer: '#584419',
    onSurface: '#231918',
    onSurfaceVariant: '#534341',
    onError: '#ffffff',
    onErrorContainer: '#93000a',
    onBackground: '#231918',
    outline: '#857371',
    outlineVariant: '#d8c2bf',
    inverseSurface: '#392e2d',
    inverseOnSurface: '#ffedea',
    inversePrimary: '#ffb4ab',
    shadow: '#000000',
    scrim: '#000000',
  },
  fonts: configureFonts({ config: fontConfig.config }),
  roundness: 4,
};

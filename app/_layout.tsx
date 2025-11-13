// app/_layout.tsx
import { paperTheme } from '@/src/theme/paper';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import HomeScreen from './HomeScreen';

// Root layout (global providers / theme would go here)
export default function RootLayout() {
  return (
    <PaperProvider theme={paperTheme}>
      <HomeScreen />
    </PaperProvider>
  );
}
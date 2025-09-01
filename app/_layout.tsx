// app/_layout.tsx
import { paperTheme } from '@/src/theme/paper';
import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';
import { PaperProvider } from 'react-native-paper';

// Root layout (global providers / theme would go here)
export default function RootLayout() {
  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar barStyle="dark-content" />
      <Stack screenOptions={{ headerShown: false }} />
    </PaperProvider>
  );
}
import { Stack } from 'expo-router';
import React from 'react';

// Root layout (global providers / theme would go here)
export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
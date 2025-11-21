import i18n from '@/src/i18n';
import { paperTheme } from '@/src/theme/paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { PaperProvider } from 'react-native-paper';

// Root layout (global providers / theme would go here)
export default function RootLayout() {
  useEffect(() => {
    (async () => {
      const savedLang = await AsyncStorage.getItem('language');
      i18n.changeLanguage(savedLang || 'vi');
    })();
  }, []);

  return (
    <PaperProvider theme={paperTheme}>
      <I18nextProvider i18n={i18n}>
        <Stack screenOptions={{ headerShown: false }} />
      </I18nextProvider>
    </PaperProvider>
  );
}
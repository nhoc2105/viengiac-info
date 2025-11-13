import React, { useEffect } from 'react';
import { useTheme } from 'react-native-paper';

import PostList from '@/src/features/posts/PostList';
import i18n from '@/src/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nextProvider } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {

  useEffect(() => {
    (async () => {
      const savedLang = await AsyncStorage.getItem('language');
      i18n.changeLanguage(savedLang || 'vi');
    })();
  }, []);

  const theme = useTheme();

  return (
    <I18nextProvider i18n={i18n}>
      <SafeAreaView style={{ backgroundColor: theme.colors.surfaceVariant }}>
        <PostList />
      </SafeAreaView>
    </I18nextProvider>
  );
}
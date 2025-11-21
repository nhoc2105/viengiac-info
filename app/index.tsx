import React from 'react';
import { useTheme } from 'react-native-paper';

import PostList from '@/src/features/posts/PostList';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {

  const theme = useTheme();

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.surface }}>
      <PostList />
    </SafeAreaView>
  );
}
// src/shared/components/loading-footer/LoadingFooter.tsx
import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';

export default function LoadingFooter({
  loading,
  canLoadMore,
  onLoadMore,
}: {
  loading: boolean;
  canLoadMore: boolean;
  onLoadMore: () => void;
}) {
  const theme = useTheme();

  if (loading) {
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!canLoadMore) {
    return (
      <Text
        variant="bodySmall"
        style={{
          textAlign: 'center',
          color: theme.colors.onSurfaceVariant,
          paddingVertical: 16,
          opacity: 0.8,
        }}
      >
        — End —
      </Text>
    );
  }

  return (
    <Button
      mode="contained-tonal"
      onPress={onLoadMore}
      style={{ alignSelf: 'center', marginVertical: 12 }}
      icon="chevron-down"
    >
      Load more
    </Button>
  );
}
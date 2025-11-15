import React from 'react';
import { View } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';

export default function EmptyView({ title = 'No posts yet.' }) {
  const theme = useTheme();
  return (
    <View style={{ padding: 24, alignItems: 'center' }}>
      <List.Icon color={theme.colors.onSurfaceVariant} icon="newspaper-variant-outline" />
      <Text
        variant="bodyMedium"
        style={{ color: theme.colors.onSurfaceVariant, marginTop: 4, textAlign: 'center' }}
      >
        {title}
      </Text>
    </View>
  );
}
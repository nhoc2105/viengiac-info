import React from 'react';
import { View } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';

export default function ErrorView({ message }: { message: string }) {
  const theme = useTheme();
  return (
    <View style={{ padding: 16 }}>
      <List.Item
        left={(props) => <List.Icon {...props} color={theme.colors.error} icon="alert-circle" />}
        title="Something went wrong"
        description={message}
        titleStyle={{ color: theme.colors.error }}
        descriptionNumberOfLines={4}
      />
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
        Pull to refresh to try again.
      </Text>
    </View>
  );
}
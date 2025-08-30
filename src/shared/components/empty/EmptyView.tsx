import React from 'react';
import { Text, View } from 'react-native';
import { emptyViewStyles } from './EmptyView.styles';

export default function EmptyView({ title = 'No posts yet.' }) {
  return (
    <View style={emptyViewStyles.wrap}>
      <Text style={emptyViewStyles.text}>{title}</Text>
    </View>
  );
}

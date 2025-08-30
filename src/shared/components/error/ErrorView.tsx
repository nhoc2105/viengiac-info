import React from 'react';
import { Text, View } from 'react-native';
import { errorViewStyles } from './ErrorView.styles';

export default function ErrorView({ message }: { message: string }) {
  return (
    <View style={errorViewStyles.wrap}>
      <Text style={errorViewStyles.text}>{message}</Text>
    </View>
  );
}

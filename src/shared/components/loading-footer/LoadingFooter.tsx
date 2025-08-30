import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { loadingFooterStyles } from './LoadingFooter.styles';

export default function LoadingFooter({
  loading,
  canLoadMore,
  onLoadMore,
}: {
  loading: boolean;
  canLoadMore: boolean;
  onLoadMore: () => void;
}) {
  if (loading) {
    return (
      <View style={loadingFooterStyles.wrap}><ActivityIndicator /></View>
    );
  }
  if (!canLoadMore) {
    return <Text style={loadingFooterStyles.end}>— End —</Text>;
  }
  return (
    <TouchableOpacity onPress={onLoadMore} style={loadingFooterStyles.btn} activeOpacity={0.8}>
      <Text style={loadingFooterStyles.btnText}>Load more</Text>
    </TouchableOpacity>
  );
}
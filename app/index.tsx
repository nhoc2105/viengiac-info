import React from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { ActivityIndicator, Banner, Divider, useTheme } from 'react-native-paper';

import EmptyView from '@/src/components/empty/EmptyView';
import PostItem from '@/src/features/posts/PostItem';
import { usePosts } from '@/src/features/posts/hooks/usePosts';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { items, loading, error, refreshing, canLoadMore, refresh, loadMore } = usePosts();
  const theme = useTheme();

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {Boolean(error) && (
        <Banner visible icon="alert-circle" style={{ marginHorizontal: 12, marginTop: 8 }}>
          {error}
        </Banner>
      )}

      <FlatList
        data={items}
        keyExtractor={(a) => String(a.id)}
        renderItem={({ item }) => <PostItem post={item} />}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={refresh} 
            colors={[theme.colors.primary]}            // Android spinner color(s)
            tintColor={theme.colors.primary}           // iOS spinner color
            progressBackgroundColor={theme.colors.surface} />
        }
        ItemSeparatorComponent={() => (
          <Divider />
        )}
        ListEmptyComponent={!loading && !error ? <EmptyView /> : null}
        ListFooterComponent={() =>
          (!refreshing) ? (
            <View style={{ 
              height: 60, 
              justifyContent: 'center', 
              alignItems: 'center',
              backgroundColor: theme.colors.surface
            }}>
              <ActivityIndicator size="small" />
            </View>
          ) : null
       }
        onEndReached={() => {
          if (!loading && canLoadMore) {
            loadMore();
          }
        }}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
}
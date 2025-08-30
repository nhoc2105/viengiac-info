// app/index.tsx
import React from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { Appbar, Banner, Divider, useTheme } from 'react-native-paper';

import EmptyView from '@/src/shared/components/empty/EmptyView';
import LoadingFooter from '@/src/shared/components/loading-footer/LoadingFooter';
import PostCard from '@/src/shared/components/post-card/PostCard';
import { usePosts } from '../src/features/posts/hooks/usePosts';

export default function HomeScreen() {
  const { items, loading, error, refreshing, canLoadMore, refresh, loadMore } = usePosts();
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* MD3 App Bar */}
      <Appbar.Header mode="center-aligned" elevated>
        <Appbar.Content title="Vien Giac Reader" />
      </Appbar.Header>

      {/* Error as MD3 Banner */}
      {Boolean(error) && (
        <Banner
          visible
          icon="alert-circle"
          style={{ marginHorizontal: 12, marginTop: 8 }}
        >
          {error}
        </Banner>
      )}

      <FlatList
        data={items}
        keyExtractor={(p) => String(p.id)}
        renderItem={({ item }) => <PostCard post={item} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        contentContainerStyle={{
          padding: 12,
          paddingBottom: 28,
          gap: 12,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
        ListEmptyComponent={!loading && !error ? <EmptyView /> : null}
        ListFooterComponent={
          <View style={{ marginTop: 8 }}>
            <Divider style={{ opacity: 0.4 }} />
            <LoadingFooter
              loading={loading}
              canLoadMore={canLoadMore}
              onLoadMore={loadMore}
            />
          </View>
        }
      />
    </View>
  );
}
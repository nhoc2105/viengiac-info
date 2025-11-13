import React, { useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { ActivityIndicator, Banner, Divider, useTheme } from 'react-native-paper';

import EmptyView from '@/src/components/empty/EmptyView';
import PostItem from '@/src/features/posts/PostItem';
import { usePosts } from '@/src/features/posts/hooks/usePosts';
import { Post } from './post.types';

export default function PostList() {
  const { items, loading, error, refreshing, canLoadMore, refresh, loadMore } = usePosts();
  const theme = useTheme();
  const keyExtractor = useCallback((item: Post) => String(item.id), []);
  const renderItem = useCallback(({ item }: { item: Post }) => <PostItem post={item} />, []);
  const onEndReached = useCallback(() => {
    if (!loading && canLoadMore) loadMore();
  }, [loading, canLoadMore, loadMore]);
  const refreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={refresh}
        colors={[theme.colors.primary]}
        tintColor={theme.colors.primary}
        progressBackgroundColor={theme.colors.surface}
      />
    ),
    [refreshing, refresh, theme.colors.primary, theme.colors.surface]
  );

  const listFooter = useMemo(
    () =>
      !refreshing ? (
        <View
          style={{
            height: 72,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.onTertiary,
          }}
        >
          <ActivityIndicator size="small" testID="ActivityIndicator"/>
        </View>
      ) : null,
    [refreshing, theme.colors.onTertiary]
  );
  const listEmpty = useMemo(() => (!loading && !error ? <EmptyView /> : null), [loading, error]);
  const ItemSeparatorComponent = useCallback(() => <Divider />, []);

  return (
    <>
      {Boolean(error) && (
        <Banner visible icon="alert-circle" style={{ marginHorizontal: 12, marginTop: 8 }}>
          {error}
        </Banner>
      )}

      <FlatList
        testID="FlatList"
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshControl={refreshControl}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListEmptyComponent={listEmpty}
        ListFooterComponent={listFooter}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
      />
    </>
  );
}
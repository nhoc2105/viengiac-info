import React, { useCallback, useMemo } from 'react';
import { Dimensions, FlatList, RefreshControl, View } from 'react-native';
import { ActivityIndicator, Banner, Divider, useTheme } from 'react-native-paper';

import EmptyView from '@/src/components/empty/EmptyView';
import { usePosts } from '@/src/features/posts/hooks/usePosts';
import PostItem, { COVER_SIZE } from '@/src/features/posts/PostItem';
import { Post } from './post.types';
import PostItemSkeleton from './PostItemSkeleton';

export default function PostList() {
  const { items, loading, error, refreshing, canLoadMore, refresh, loadMore } = usePosts();
  const theme = useTheme();

  /** Stable callbacks */
  const keyExtractor = useCallback((item: Post) => String(item.id), []);
  const renderItem = useCallback(({ item }: { item: Post }) => <PostItem post={item} />, []);
  const onEndReached = useCallback(() => {
    if (!loading && canLoadMore) loadMore();
  }, [loading, canLoadMore, loadMore]);

  /** Refresh control */
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

  /** Skeleton for empty state when loading */
  const listEmptyComponent = useMemo(() => {
    if (loading && items.length === 0) {
      const skeletonCount = Math.ceil(Dimensions.get('window').height / (COVER_SIZE.height + 16));
      return (
        <View style={{ padding: 16 }} testID='SkeletonLoader'>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <PostItemSkeleton key={i} />
          ))}
        </View>
      );
    }
    if (!loading && !error) return <EmptyView />;
    return null;
  }, [loading, items.length, error]);

  /** Footer for loading more */
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
        ListEmptyComponent={listEmptyComponent}
        ListFooterComponent={listFooter}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews
      />
    </>
  );
}
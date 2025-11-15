import React, { useCallback, useMemo } from 'react';
import { BackHandler, Dimensions, FlatList, RefreshControl, View } from 'react-native';
import { ActivityIndicator, Divider, useTheme } from 'react-native-paper';

import { usePosts } from '@/src/features/posts/hooks/usePosts';
import PostItem, { COVER_SIZE } from '@/src/features/posts/PostItem';
import i18n from '@/src/i18n';
import EmptyView from '@/src/shared/components/basic/empty/EmptyView';
import SimpleDialog from '@/src/shared/components/basic/simple-dialog/SimpleDialog';
import useNetworkStatus from '@/src/shared/hooks/useNetworkStatus';
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

  const listEmptyComponent = useMemo(() => {
    if (loading && items.length === 0) {
      const skeletonCount = Math.ceil(Dimensions.get('window').height / (COVER_SIZE.height + 16));
      return (
        <View testID='SkeletonLoader'>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <PostItemSkeleton key={i} />
          ))}
        </View>
      );
    }
    if (!loading && !error) return <EmptyView title={i18n.t('components.basic.empty-view.title')} />;
    return null;
  }, [loading, items.length, error]);

  /** Footer for loading more */
  const listFooter = useMemo(
    () =>
      (!refreshing && items.length > 0) ? (
        <View
          style={{
            height: 72,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.onTertiary,
          }}
        >
          <ActivityIndicator size="small" testID="ActivityIndicator" />
        </View>
      ) : null,
    [refreshing, theme.colors.onTertiary]
  );

  const ItemSeparatorComponent = useCallback(() => <Divider />, []);

  const isOnline = useNetworkStatus();

  return (
    <>
      {
        Boolean(error) ? (
          <SimpleDialog
            visible={Boolean(error)}
            title={i18n.t("error.server.title")}
            message={i18n.t("error.server.message")}
            icon="cloud-off-outline"
            primaryLabel={i18n.t("button.retry")}
            secondaryLabel={i18n.t("button.quit")}
            onPrimaryAction={loadMore}
            onSecondaryAction={() => BackHandler.exitApp()}
          />
        ) : null
      }
      {
        Boolean(!isOnline) ? (
          <SimpleDialog
            visible={!isOnline}
            title={i18n.t('error.network.title')}
            message={i18n.t('error.network.message')}
            icon={'wifi-off'}
            primaryLabel={i18n.t('button.retry')}
            secondaryLabel={i18n.t('button.quit')}
            onPrimaryAction={loadMore}
            onSecondaryAction={() => BackHandler.exitApp()}
          />
        ) : null
      }


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
        initialNumToRender={20}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews
      />
    </>
  );
}
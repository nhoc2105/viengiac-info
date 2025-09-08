// app/index.tsx
import React from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { Banner, Divider, useTheme } from 'react-native-paper';

import EmptyView from '@/src/components/empty/EmptyView';
import LoadingFooter from '@/src/components/loading-footer/LoadingFooter';
import ArticleItem from '@/src/features/articles/ArticleItem';
import { useArticles } from '@/src/features/articles/hooks/useArticles';

export default function HomeScreen() {
  const { items, loading, error, refreshing, canLoadMore, refresh, loadMore } = useArticles();
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {Boolean(error) && (
        <Banner visible icon="alert-circle" style={{ marginHorizontal: 12, marginTop: 8 }}>
          {error}
        </Banner>
      )}

      <FlatList
        data={items}
        keyExtractor={(a) => String(a.id)}
        renderItem={({ item }) => <ArticleItem article={item} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        contentContainerStyle={{ paddingBottom: 28 }}
        ItemSeparatorComponent={() => (
          <Divider style={{ opacity: 0.5 }} />
        )}
        ListEmptyComponent={!loading && !error ? <EmptyView /> : null}
        ListFooterComponent={
          <View style={{ marginTop: 8, paddingHorizontal: 12 }}>
            <Divider style={{ opacity: 0.4 }} />
            <LoadingFooter loading={loading} canLoadMore={canLoadMore} onLoadMore={loadMore} />
          </View>
        }
      />
    </View>
  );
}
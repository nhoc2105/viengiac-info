import EmptyView from '@/src/shared/components/empty/EmptyView';
import ErrorView from '@/src/shared/components/error/ErrorView';
import LoadingFooter from '@/src/shared/components/loading-footer/LoadingFooter';
import PostCard from '@/src/shared/components/post-card/PostCard';
import React from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { usePosts } from '../src/features/posts/hooks/usePosts';

export default function HomeScreen() {
  const { items, loading, error, refreshing, canLoadMore, refresh, loadMore } = usePosts();

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(p) => String(p.id)}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        ListHeaderComponent={
          <View style={{ paddingVertical: 10 }}>
            <Text style={styles.header}>Vien Giac Reader</Text>
            {error && <ErrorView message={error} />}
          </View>
        }
        ListEmptyComponent={!loading && !error ? <EmptyView /> : null}
        ListFooterComponent={
          <LoadingFooter loading={loading} canLoadMore={canLoadMore} onLoadMore={loadMore} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 12 },
  header: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
});
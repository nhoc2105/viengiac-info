import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// -------- Config --------
const SITE = 'https://viengiac.info';
const POSTS_URL = `${SITE}/wp-json/wp/v2/posts`;
// include featured media & author in one response
const BASE_QUERY = `_embed&per_page=10`;

// -------- Types (minimal) --------
type WPEmbeddedMedia = {
  source_url?: string;
  media_details?: { sizes?: Record<string, { source_url: string }> };
};
type WPPost = {
  id: number;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    author?: { name?: string }[];
    'wp:featuredmedia'?: WPEmbeddedMedia[];
  };
};

export default function App() {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (pageToLoad = 1, replace = false) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${POSTS_URL}?${BASE_QUERY}&page=${pageToLoad}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      // Read WordPress pagination headers
      // X-WP-Total / X-WP-TotalPages per WP REST API docs
      const tp = res.headers.get('X-WP-TotalPages');
      if (tp) setTotalPages(Number(tp));

      const data: WPPost[] = await res.json();
      setPosts(prev => (replace ? data : [...prev, ...data]));
      setPage(pageToLoad);
    } catch (e: any) {
      setError(`Could not load posts (${e.message}).`);
    } finally {
      setLoading(false);
      if (refreshing) setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts(1, true);
  };

  const canLoadMore = useMemo(
    () => totalPages === null || page < (totalPages ?? 0),
    [page, totalPages]
  );

  const renderItem = ({ item }: { item: WPPost }) => {
    const title = stripHtml(item.title?.rendered || '');
    const excerpt = stripHtml(item.excerpt?.rendered || '').slice(0, 180) + '…';
    const author = item._embedded?.author?.[0]?.name || '';
    const featured = getFeaturedImage(item);

    return (
      <TouchableOpacity
        onPress={() => Linking.openURL(item.link)}
        style={styles.card}
        activeOpacity={0.7}
      >
        {featured ? (
          <Image source={{ uri: featured }} style={styles.image} resizeMode="cover" />
        ) : null}
        <View style={styles.textWrap}>
          <Text style={styles.title}>{title}</Text>
          {!!author && <Text style={styles.meta}>Tác giả: {author}</Text>}
          <Text style={styles.excerpt}>{excerpt}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(p) => String(p.id)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <>
            <Text style={styles.header}>Vien Giac Reader</Text>
            {error && <Text style={styles.error}>{error}</Text>}
          </>
        }
        ListFooterComponent={
          <View style={{ paddingVertical: 20 }}>
            {loading && <ActivityIndicator />}
            {!loading && canLoadMore && (
              <TouchableOpacity
                style={styles.loadMore}
                onPress={() => fetchPosts(page + 1)}
              >
                <Text style={styles.loadMoreText}>Load more</Text>
              </TouchableOpacity>
            )}
            {!loading && !canLoadMore && posts.length > 0 && (
              <Text style={styles.end}>— End —</Text>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

// Utilities
function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, '').trim();
}

function getFeaturedImage(post: WPPost) {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  const sizes = media?.media_details?.sizes || {};
  // Prefer medium/large if available
  const prefer = sizes['medium']?.source_url || sizes['large']?.source_url;
  return prefer || media?.source_url || null;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    fontSize: 22, fontWeight: '700', textAlign: 'center',
    paddingVertical: 10,
  },
  error: { color: 'crimson', textAlign: 'center', marginVertical: 8 },
  card: {
    backgroundColor: '#f9f9fb',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 2 },
    }),
  },
  image: { width: '100%', height: 180, backgroundColor: '#eee' },
  textWrap: { padding: 12 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  meta: { fontSize: 12, color: '#666', marginBottom: 6 },
  excerpt: { fontSize: 14, color: '#333' },
  loadMore: {
    alignSelf: 'center', backgroundColor: '#2e7d32',
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8
  },
  loadMoreText: { color: '#fff', fontWeight: '600' },
  end: { textAlign: 'center', color: '#666' },
});

import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchPosts } from '../../../api/wp';
import type { WPPost } from '../post.types';

export function usePosts() {
  const [items, setItems] = useState<WPPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (pageToLoad = 1, replace = false) => {
      setLoading(true);
      setError(null);
      try {
        const { posts, totalPages } = await fetchPosts(pageToLoad);
        setTotalPages(totalPages);
        setItems(prev => (replace ? posts : [...prev, ...posts]));
        setPage(pageToLoad);
      } catch (e: any) {
        setError(e?.message || 'Failed to load posts');
      } finally {
        setLoading(false);
        if (refreshing) setRefreshing(false);
      }
    },
    [refreshing]
  );

  // initial load
  useEffect(() => {
    load(1, true);
  }, [load]);

  const canLoadMore = useMemo(
    () => totalPages === null || page < (totalPages ?? 0),
    [page, totalPages]
  );

  const refresh = () => {
    setRefreshing(true);
    load(1, true);
  };

  const loadMore = () => {
    if (!loading && canLoadMore) load(page + 1);
  };

  return { items, loading, error, refreshing, canLoadMore, refresh, loadMore };
}
import { providers } from "@/src/api/providers";
import { AggregatedPostFeed } from "@/src/api/providers/aggregated-post-feed";
import { PAGE_SIZE } from "@/src/constants/config.const";
import { useCallback, useEffect, useRef, useState } from "react";
import { Post } from "../post.types";

export function usePosts() {
  const feedRef = useRef<AggregatedPostFeed>(null);
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canLoadMore, setCanLoadMore] = useState(true);

  const ensureFeed = () => {
    if (!feedRef || !feedRef.current) {
      feedRef.current = new AggregatedPostFeed(providers, PAGE_SIZE);
    }
    return feedRef.current;
  };

  const load = useCallback(async (replace = false) => {
    setLoading(true);
    setError(null);
    try {
      const feed = ensureFeed();
      const { items: nextItems, canLoadMore } = await feed.next();
      setItems(prev => replace ? nextItems : [...prev, ...nextItems]);
      setCanLoadMore(canLoadMore);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load posts');
    } finally {
      setLoading(false);
      if (refreshing) setRefreshing(false);
    }
  }, [refreshing]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    ensureFeed().reset();
    setItems([]);
    setCanLoadMore(true);
    load(true);
  }, [load]);

  const loadMore = useCallback(() => {
    if (!loading && canLoadMore) load(false);
  }, [loading, canLoadMore, load]);


  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { refresh(); }, []);

  return { items, loading, error, refreshing, canLoadMore, refresh, loadMore };
}
import { providers } from "@/src/api/providers";
import { AggregatedFeed } from "@/src/api/providers/aggregator";
import { useCallback, useEffect, useRef, useState } from "react";
import { Article } from "../article.types";

const PAGE_SIZE = 20; // reuse your preferred UI page size

export function useArticles() {
  const feedRef = useRef<AggregatedFeed>(null);
  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canLoadMore, setCanLoadMore] = useState(true);

  const ensureFeed = () => {
    if (!feedRef || !feedRef.current) {
      feedRef.current = new AggregatedFeed(providers, PAGE_SIZE);
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
      setError(e?.message ?? 'Failed to load articles');
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

  // initial load
  useEffect(() => { refresh(); }, []);

  return { items, loading, error, refreshing, canLoadMore, refresh, loadMore };
}
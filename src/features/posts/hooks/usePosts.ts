import { createFirebaseProvider } from "@/src/api/providers/firebase/firebase.provider";
import { PAGE_SIZE } from "@/src/constants/config.const";
import { useCallback, useEffect, useRef, useState } from "react";
import { Post } from "../post.types";

export function usePosts() {
  const providerRef = useRef(createFirebaseProvider());
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canLoadMore, setCanLoadMore] = useState(true);

  const load = useCallback(async (replace = false) => {
    setLoading(true);
    setError(null);
    
    try {
          const { items: nextItems, canLoadMore } = await providerRef.current.loadPage(1, PAGE_SIZE);
          setItems(prev => (replace ? nextItems : [...prev, ...nextItems]));
          setCanLoadMore(canLoadMore);
        } catch (e: any) {
          setError(e?.message ?? "Failed to load posts");
        } finally {
          setLoading(false);
        }
      }, []);


  const refresh = useCallback(async () => {
    providerRef.current = createFirebaseProvider(); // reset pagination
    setRefreshing(true);
    setItems([]);
    setCanLoadMore(true);
    await load(true);
    setRefreshing(false);
  }, [load]);


  const loadMore = useCallback(() => {
    if (!loading && canLoadMore) load(false);
  }, [loading, canLoadMore, load]);


  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  return { items, loading, error, refreshing, canLoadMore, refresh, loadMore };
}
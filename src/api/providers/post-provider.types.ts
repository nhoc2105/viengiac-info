import type { Post } from '@/src/features/posts/post.types';

export type LoadPageResult = {
  items: Post[];
  /** Whether the provider can return more items beyond the requested page */
  canLoadMore: boolean;
};

export interface PostProvider {
  /** Stable identifier; keep it short (e.g., 'wp:viengiac') */
  id: string;
  /** For UI / debugging */
  label: string;
  /**
   * Load one page of posts from this provider.
   * `page` is 1-based. `pageSize` is the desired number of items.
   */
  loadPage(page: number, pageSize: number): Promise<LoadPageResult>;
}
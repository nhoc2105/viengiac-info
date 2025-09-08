import type { Article } from '@/src/features/articles/article.types';

export type LoadPageResult = {
  items: Article[];
  /** Whether the provider can return more items beyond the requested page */
  canLoadMore: boolean;
};

export interface NewsProvider {
  /** Stable identifier; keep it short (e.g., 'wp:viengiac') */
  id: string;
  /** For UI / debugging */
  label: string;
  /**
   * Load one page of articles from this provider.
   * `page` is 1-based. `pageSize` is the desired number of items.
   */
  loadPage(page: number, pageSize: number): Promise<LoadPageResult>;
}
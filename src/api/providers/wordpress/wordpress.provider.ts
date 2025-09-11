import { Post } from '@/src/features/posts/post.types';
import { stripHtml } from '@/src/utils/html.utils';
import type { LoadPageResult, NewsProvider } from '../provider.types';
import { WordPressApiPost, WordPressConfig } from './wordpress.types';
import { buildPostsUrl, getFeaturedImage } from './wordpress.utils';

function normalize(post: WordPressApiPost, sourceId: string, sourceName?: string): Post {
  const title = stripHtml(post.title?.rendered ?? '').trim();
  const author = post._embedded?.author?.[0]?.name;
  const imageUrl = getFeaturedImage(post);
  return {
    id: `${sourceId}:${post.id}`,
    sourceId,
    sourceName, 
    title,
    summary: post.excerpt?.rendered ? stripHtml(post.excerpt.rendered) : undefined,
    url: post.link,
    imageUrl,
    author,
    publishedAt: post.modified || post.date, // prefer modified date if available
  };
}


export function createWordPressProvider(cfg: WordPressConfig): NewsProvider {
  const id = `wp:${new URL(cfg.site).hostname}`;
  const label = cfg.label ?? new URL(cfg.site).hostname;

  return {
    id,
    label,
    async loadPage(page: number, pageSize: number): Promise<LoadPageResult> {
      const url = buildPostsUrl(cfg, page, pageSize);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`WP HTTP ${res.status}`);
      const totalPagesHeader = res.headers.get('X-WP-TotalPages');
      const totalPages = totalPagesHeader ? Number(totalPagesHeader) : null;
      const data: WordPressApiPost[] = await res.json();
      const items = data.map(p => normalize(p, id, cfg.label));
      const canLoadMore = totalPages === null ? (items.length === pageSize) : (page < (totalPages ?? 0));
      return { items, canLoadMore };
    },
  };
}
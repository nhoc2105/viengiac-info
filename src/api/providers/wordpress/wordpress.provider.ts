import { Article } from '@/src/features/articles/article.types';
import { stripHtml } from '@/src/utils/html.utils';
import type { LoadPageResult, NewsProvider } from '../provider.types';
import { WordPressConfig, WordPressPost } from './wordpress.types';

function buildPostsUrl(cfg: WordPressConfig, page: number, pageSize: number) {
  const url = new URL(`${cfg.site.replace(/\/$/, '')}/wp-json/wp/v2/posts`);
  url.searchParams.set('per_page', String(pageSize));
  url.searchParams.set('page', String(page));
  if (cfg.useEmbed) url.searchParams.set('_embed', '');
  return url.toString();
}

function normalize(post: WordPressPost, sourceId: string, sourceName?: string): Article {
  const title = stripHtml(post.title?.rendered ?? '').trim();
  const author = post._embedded?.author?.[0]?.name;
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  const sizes = media?.media_details?.sizes ?? {};
  const imageUrl = sizes['medium']?.source_url
    || sizes['large']?.source_url
    || sizes['medium_large']?.source_url
    || media?.source_url;
  return {
    id: `${sourceId}:${post.id}`,
    sourceId,
    sourceName, 
    title,
    summary: post.excerpt?.rendered ? stripHtml(post.excerpt.rendered) : undefined,
    url: post.link,
    imageUrl,
    author,
    publishedAt: post.modifiedDate || post.date, // prefer modified date if available
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
      const data: WordPressPost[] = await res.json();
      const items = data.map(p => normalize(p, id, cfg.label));
      const canLoadMore = totalPages === null ? (items.length === pageSize) : (page < (totalPages ?? 0));
      return { items, canLoadMore };
    },
  };
}
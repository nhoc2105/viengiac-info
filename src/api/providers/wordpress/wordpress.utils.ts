import { WordPressApiPost, WordPressConfig } from "./wordpress.types";

export function buildPostsUrl(cfg: WordPressConfig, page: number, pageSize: number): string {
  const url = new URL(`${cfg.site.replace(/\/$/, '')}/wp-json/wp/v2/posts`);
  url.searchParams.set('per_page', String(pageSize));
  url.searchParams.set('page', String(page));
  url.searchParams.set('_embed', 'true');
  return url.toString();
}

export function getFeaturedImage(post: WordPressApiPost): string | undefined {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  const sizes = media?.media_details?.sizes || {};
  const prefer =
    sizes['medium']?.source_url ||
    sizes['large']?.source_url ||
    sizes['medium_large']?.source_url;
  return prefer || media?.source_url || undefined;
}
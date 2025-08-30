import type { WPPost } from '../../features/posts/post.types';

export function getFeaturedImage(post: WPPost) {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  const sizes = media?.media_details?.sizes || {};
  const prefer =
    sizes['medium']?.source_url ||
    sizes['large']?.source_url ||
    sizes['medium_large']?.source_url;
  return prefer || media?.source_url || null;
}
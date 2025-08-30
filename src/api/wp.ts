import { PAGE_SIZE, POSTS_ENDPOINT, USE_EMBED } from '../constants/config.const';
import type { WPPost } from '../features/posts/domain.types';

// Build the query string for posts
function makePostsUrl(page: number) {
  const params = new URLSearchParams();
  if (USE_EMBED) params.append('_embed', '');
  params.append('per_page', String(PAGE_SIZE));
  params.append('page', String(page));
  return `${POSTS_ENDPOINT}?${params.toString()}`;
}

/**
 * Fetch posts with pagination headers per WordPress REST API.
 * Returns posts plus totalPages (if present).
 * Docs: _embed for related resources; X-WP-TotalPages for pagination.
 */
export async function fetchPosts(page: number) {
  const res = await fetch(makePostsUrl(page));
  if (!res.ok) {
    const msg = `HTTP ${res.status}`;
    throw new Error(msg);
  }

  const totalPagesHeader = res.headers.get('X-WP-TotalPages');
  const totalPages = totalPagesHeader ? Number(totalPagesHeader) : null;

  const data: WPPost[] = await res.json();
  return { posts: data, totalPages };
}
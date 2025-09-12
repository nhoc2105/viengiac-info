import type { WordPressApiPost, WordPressConfig } from '@/src/api/providers/wordpress/wordpress.types';
import { buildPostsUrl, getFeaturedImage } from '@/src/api/providers/wordpress/wordpress.utils';

describe('wordpress.utils', () => {
  it('buildPostsUrl composes correct URL and trims trailing slash', () => {
    const cfg: WordPressConfig = { site: 'https://example.com/' };
    const url = buildPostsUrl(cfg, 2, 10);
    expect(url).toBe('https://example.com/wp-json/wp/v2/posts?per_page=10&page=2&_embed=true');
  });

  it('getFeaturedImage prefers sized images then falls back', () => {
    const post: WordPressApiPost = {
      id: 1,
      date: '2025-01-01T00:00:00Z',
      modified: '2025-01-02T00:00:00Z',
      link: 'https://example.com/p/1',
      title: { rendered: 't' },
      _embedded: {
        'wp:featuredmedia': [{
          source_url: 'https://img/full.jpg',
          media_details: {
            sizes: {
              large: { source_url: 'https://img/large.jpg' },
              medium: { source_url: 'https://img/medium.jpg' },
              medium_large: { source_url: 'https://img/medium_large.jpg' },
            },
          },
        }],
      },
    };
    expect(getFeaturedImage(post)).toBe('https://img/medium.jpg');

    const noSizes: WordPressApiPost = {
      ...post,
      _embedded: { 'wp:featuredmedia': [{ source_url: 'https://img/full.jpg' }] },
    } as any;
    expect(getFeaturedImage(noSizes)).toBe('https://img/full.jpg');

    const none: WordPressApiPost = { ...post, _embedded: undefined } as any;
    expect(getFeaturedImage(none)).toBeUndefined();
  });
});

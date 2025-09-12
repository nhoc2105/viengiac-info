import { AggregatedPostFeed } from '@/src/api/providers/aggregated-post-feed';
import type { NewsProvider } from '@/src/api/providers/provider.types';
import type { Post } from '@/src/features/posts/post.types';

function makePost(id: string, d: string): Post {
  return { id, sourceId: id.split(':')[0], title: id, url: 'u', publishedAt: d } as any;
}

describe('AggregatedPostFeed', () => {
  it('should merge, sort, chunk, and maintain buffers', async () => {
    // GIVEN
    const p1Items = [
      makePost('p1:1', '2025-01-03T00:00:00Z'),
      makePost('p1:2', '2025-01-01T00:00:00Z'),
    ];
    const p2Items = [
      makePost('p2:1', '2025-01-02T00:00:00Z'),
      makePost('p2:2', '2025-01-01T12:00:00Z'),
    ];

    const provider = (id: string, items: Post[]): NewsProvider => ({
      id,
      label: id,
      async loadPage(page: number, pageSize: number) {
        const start = (page - 1) * pageSize;
        const chunk = items.slice(start, start + pageSize);
        const canLoadMore = start + pageSize < items.length;
        return { items: chunk, canLoadMore };
      },
    });

    const feed = new AggregatedPostFeed([
      provider('p1', p1Items),
      provider('p2', p2Items),
    ], 3);

    // WHEN
    let res = await feed.next();

    // THEN
    expect(res.items.map(i => i.id)).toEqual(['p1:1', 'p2:1', 'p2:2']); // sorted desc by publishedAt
    expect(res.canLoadMore).toBe(true); // p1 still has items

    res = await feed.next();
    expect(res.items.map(i => i.id)).toEqual(['p1:2']);
    expect(res.canLoadMore).toBe(false);

    // reset
    feed.reset();
    res = await feed.next();
    expect(res.items).toHaveLength(3);
  });
});

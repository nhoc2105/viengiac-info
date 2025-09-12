import { createWordPressProvider } from '@/src/api/providers/wordpress/wordpress.provider';

const json = (data: any) => Promise.resolve(data);

describe('wordpress.provider', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn();
  });

  it('should load and normalize posts', async () => {
    // GIVEN
    const cfg = { site: 'https://site.example', label: 'My Site' };
    const provider = createWordPressProvider(cfg);

    const headers = new Map<string, string>();
    headers.set('X-WP-TotalPages', '3');

    const posts = [
      {
        id: 10,
        date: '2025-01-01T00:00:00Z',
        modified: '2025-01-02T00:00:00Z',
        link: 'https://site.example/p/10',
        title: { rendered: '<b>Hello</b>' },
        excerpt: { rendered: '<p>Ex</p>' },
        _embedded: { author: [{ name: 'Alice' }], 'wp:featuredmedia': [{ source_url: 'x' }] },
      },
    ];

    (global as any).fetch.mockResolvedValueOnce({ ok: true, headers: { get: (k: string) => headers.get(k) }, json: () => json(posts) });

    // WHEN
    const res = await provider.loadPage(1, 20);

    // THEN
    expect(res.items).toHaveLength(1);
    const item = res.items[0];
    expect(item.id).toBe('wp:site.example:10');
    expect(item.sourceName).toBe('My Site');
    expect(item.title).toBe('Hello');
    expect(item.summary).toBe('Ex');
    expect(item.author).toBe('Alice');
    expect(item.publishedAt).toBe('2025-01-02T00:00:00Z'); // modified preferred over date
    expect(res.canLoadMore).toBe(true);
  });

  it('should use item count heuristic when header missing and handles non-ok', async () => {
    // GIVEN
    const provider = createWordPressProvider({ site: 'https://a.b' });

    // Header missing -> canLoadMore iff items.length === pageSize
    (global as any).fetch.mockResolvedValueOnce({ ok: true, headers: { get: () => null }, json: () => json([ { id: 1, date: '2025-01-01', modified: '2025-01-01', link: '', title: { rendered: 'T' } } ]) });
    
    // WHEN
    let res = await provider.loadPage(1, 5);

    // THEN
    expect(res.canLoadMore).toBe(false);

    // GIVEN
    (global as any).fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    // WHEN / THEN
    await expect(provider.loadPage(2, 5)).rejects.toThrow('WP HTTP 500');
  });
});

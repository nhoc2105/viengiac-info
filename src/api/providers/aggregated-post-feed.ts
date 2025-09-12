import { Post } from "@/src/features/posts/post.types";
import { NewsProvider } from "./provider.types";

export type AggregatedNext = {
  items: Post[];
  canLoadMore: boolean;
};

export class AggregatedPostFeed {
  private state: Record<string, {
    page: number;
    buffer: Post[];
    canLoadMore: boolean;
  }> = {};

  constructor(private providers: NewsProvider[], private pageSize: number) {
    providers.forEach(p => {
      this.state[p.id] = { page: 0, buffer: [], canLoadMore: true };
    });
  }

  reset() {
    Object.keys(this.state).forEach(id => {
      this.state[id] = { page: 0, buffer: [], canLoadMore: true };
    });
  }

  /**
   * Returns the next `pageSize` items aggregated across providers.
   */
  async next(): Promise<AggregatedNext> {
    // Ensure enough items are buffered from each provider
    await Promise.all(this.providers.map(async (p) => {
      const s = this.state[p.id];
      while (s.buffer.length < this.pageSize && s.canLoadMore) {
        const nextPage = s.page + 1;
        const { items, canLoadMore } = await p.loadPage(nextPage, this.pageSize);
        s.page = nextPage;
        s.canLoadMore = canLoadMore;
        s.buffer.push(...items);
        // Stop early if provider returned fewer than requested
        if (items.length === 0) break;
      }
    }));

    // Merge all buffers
    const merged: Post[] = Object.values(this.state).flatMap(s => s.buffer);

    // Sort DESC by time
    merged.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Take the next chunk
    const out = merged.slice(0, this.pageSize);

    // Remove emitted items from their respective provider buffers
    const ids = new Set(out.map(x => x.id));
    for (const pid of Object.keys(this.state)) {
      const s = this.state[pid];
      s.buffer = s.buffer.filter(a => !ids.has(a.id));
    }

    const canLoadMore = this.providers.some(p => this.state[p.id].canLoadMore) ||
                        Object.values(this.state).some(s => s.buffer.length > 0);

    return { items: out, canLoadMore };
  }
}
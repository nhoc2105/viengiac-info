export type Article = {
  /** Globally unique within the app. Use a stable key (e.g., url or api id with source) */
  id: string;
  /** Short ID of the provider/source (e.g., 'wp:viengiac', 'newsapi:tech') */
  sourceId: string;
  /** Human label of the source ('Vien Giac', 'NewsAPI – Tech') */
  sourceName?: string;

  title: string;
  summary?: string;
  url: string;            // canonical link to open in browser
  imageUrl?: string;
  author?: string;
  publishedAt: string;    // ISO8601
};
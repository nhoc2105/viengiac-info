/** Internal normalized model. */
export type Post = {
  author: string[];
  id: string;
  imageUrl: string;
  publishedAt: string;    // ISO
  sourceId: string;
  summary: string;
  title: string;
  url: string;            // canonical link to open in browser
};
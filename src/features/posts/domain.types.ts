
export type WPEmbeddedMedia = {
  source_url?: string;
  media_details?: { sizes?: Record<string, { source_url: string }> };
};

export type WPPost = {
  id: number;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    author?: { name?: string }[];
    'wp:featuredmedia'?: WPEmbeddedMedia[];
  };
};

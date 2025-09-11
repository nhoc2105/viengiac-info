/** Minimal WordPress post subset (only what we need). External shape from WordPress API */
export type WordPressApiPost = {
  id: number;
  date: string;         // ISO
  modified: string; // ISO
  link: string;
  title: { rendered: string };
  excerpt?: { rendered?: string };
  _embedded?: {
    author?: { name?: string }[];
    'wp:featuredmedia'?: {
      source_url?: string;
      media_details?: { sizes?: Record<string, { source_url: string }> };
    }[];
  };
};

export type WordPressConfig = {
  /** e.g., 'https://viengiac.info' */
  site: string;
  /** Optional UI label, e.g., 'Vien Giac' */
  label?: string;
};
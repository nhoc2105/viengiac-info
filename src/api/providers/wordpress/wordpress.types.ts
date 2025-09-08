/** Minimal WordPress post subset (only what we need) */
export type WordPressPost = {
  id: number;
  date: string;         // ISO
  modifiedDate: string; // ISO
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
  /** If true, append &_embed to speed up author/media lookup */
  useEmbed?: boolean;
};
export interface FirebasePost {
  author: string[];
  categories: string[];
  content: string;
  coverImageUrl: string;
  id: string;
  modifiedGmt: string;
  source: ApiSourceKey;
  summary: string;
  title: string;
  url: string;
}

export type ApiSourceKey = "GDPTDQ" | "VL" | "VLTDE" | "VLTVI" | "VG";
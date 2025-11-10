import { Post } from "@/src/features/posts/post.types";
import { FirebasePost } from "./firebase-post.type";

export function mapFirebasePost(firebasePost: FirebasePost): Post {
  return {
    id: firebasePost.id,
    title: firebasePost.title ?? '',
    sourceId: firebasePost.source ?? '',
    summary: firebasePost.summary ?? '',
    url: firebasePost.url ?? '',
    imageUrl: firebasePost.coverImageUrl ?? '',
    author: firebasePost.author ?? [],
    publishedAt: firebasePost.modifiedGmt ?? '',
  };
}
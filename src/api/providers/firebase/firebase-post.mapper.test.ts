
import { Post } from "@/src/features/posts/post.types";
import { mapFirebasePost } from "./firebase-post.mapper";
import { FirebasePost } from "./firebase-post.type";

describe("mapFirebasePost", () => {
  it("should map all fields correctly when all values are provided", () => {
    // GIVEN
    const firebasePost: FirebasePost = {
      id: "123",
      title: "Sample Title",
      source: 'VG',
      summary: "Sample summary",
      url: "https://example.com",
      coverImageUrl: "https://example.com/image.jpg",
      author: ["Author 1", "Author 2"],
      modifiedGmt: "2025-11-22",
      content: "Sample content",
      categories: ['cat1', 'cat3']
    };

    // WHEN
    const result: Post = mapFirebasePost(firebasePost);

    // THEN
    expect(result).toEqual({
      id: "123",
      title: "Sample Title",
      sourceId: "VG",
      summary: "Sample summary",
      url: "https://example.com",
      imageUrl: "https://example.com/image.jpg",
      author: ["Author 1", "Author 2"],
      publishedAt: "2025-11-22",
      content: "Sample content",
    });
  });
});

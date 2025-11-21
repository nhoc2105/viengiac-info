import { Post } from "../post.types";

class PostStorageService {
  private static instance: PostStorageService | null = null;
  private selectedPost?: Post;

  constructor() {
    if (PostStorageService.instance) {
      throw new Error("Use PostStorageService.getInstance() instead of new PostStorageService()");
    }
  }

  static getInstance(): PostStorageService {
    if (!PostStorageService.instance) {
      PostStorageService.instance = new PostStorageService();
    }
    return PostStorageService.instance;
  }

  setSelectedPost(post: Post): void {
    this.selectedPost = post;
  }

  getSelectedPost(): Post | undefined {
    return this.selectedPost;
  }
}

export default PostStorageService;
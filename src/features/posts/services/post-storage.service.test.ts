
import { Post } from "../post.types";
import PostStorageService from "./post-storage.service";

describe("PostStorageService", () => {
  const samplePost = { id: "1", title: "Test Post", content: "Hello World" } as Post;
  const anotherPost = { id: "2", title: "Another Post", content: "New Content" } as Post;

  beforeEach(() => {
    // GIVEN: Reset singleton state before each test
    const instance = PostStorageService.getInstance();
    instance.setSelectedPost(undefined as unknown as Post);
  });

  it("should return the same instance every time", () => {
    // GIVEN: Two calls to getInstance
    const instance1 = PostStorageService.getInstance();
    const instance2 = PostStorageService.getInstance();

    // THEN: Both instances should be the same
    expect(instance1).toBe(instance2);
  });

  it("should throw error if instantiated directly", () => {
    // GIVEN: Attempt to create a new instance directly
    // WHEN & THEN: It should throw an error
    expect(() => new (PostStorageService as any)()).toThrow(
      "Use PostStorageService.getInstance() instead of new PostStorageService()"
    );
  });

  it("should set and get selected post correctly", () => {
    // GIVEN: A singleton instance
    const service = PostStorageService.getInstance();

    // WHEN: Setting a post
    service.setSelectedPost(samplePost);

    // THEN: The selected post should match
    expect(service.getSelectedPost()).toEqual(samplePost);
  });

  it("should overwrite previously selected post", () => {
    // GIVEN: A singleton instance with an initial post
    const service = PostStorageService.getInstance();
    service.setSelectedPost(samplePost);

    // WHEN: Setting a new post
    service.setSelectedPost(anotherPost);

    // THEN: The selected post should be the new one
    expect(service.getSelectedPost()).toEqual(anotherPost);
  });

  it("should return undefined if no post is set", () => {
    // GIVEN: A fresh singleton instance
    const service = PostStorageService.getInstance();

    // THEN: No post should be selected
    expect(service.getSelectedPost()).toBeUndefined();
  });

  it("should allow clearing selected post by setting undefined", () => {
    // GIVEN: A singleton instance with a post
    const service = PostStorageService.getInstance();
    service.setSelectedPost(samplePost);

    // WHEN: Clearing the post
    service.setSelectedPost(undefined as unknown as Post);

    // THEN: The selected post should be undefined
    expect(service.getSelectedPost()).toBeUndefined();
  });
});

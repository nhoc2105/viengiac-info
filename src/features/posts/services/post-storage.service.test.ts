
import { Post } from "../post.types";
import PostStorageService from "./post-storage.service";

describe("PostStorageService", () => {
  const samplePost = { id: '1', title: "Test Post", content: "Hello World" } as Post;

  it("should return the same instance every time", () => {
    // GIVEN
    const instance1 = PostStorageService.getInstance();
    const instance2 = PostStorageService.getInstance();

    // THEN
    expect(instance1).toBe(instance2);
  });

  it("should set and get selected post correctly", () => {
    // GIVEN
    const service = PostStorageService.getInstance();

    // WHNE
    service.setSelectedPost(samplePost);

    // THEN
    expect(service.getSelectedPost()).toEqual(samplePost);
  });

  it("should return undefined if no post is set", () => {
    // GIVEN
    const service = PostStorageService.getInstance();
    
    // WHEN
    service.setSelectedPost(undefined as unknown as Post);

    // THEN
    expect(service.getSelectedPost()).toBeUndefined();
  });
});

import type { Post } from '@/src/features/posts/post.types';
import type { QueryDocumentSnapshot } from 'firebase/firestore';
import { getDocs } from 'firebase/firestore';
import { createFirebaseProvider } from './firebase.provider';

jest.mock('firebase/firestore', () => {
  const original = jest.requireActual('firebase/firestore');
  return {
    ...original,
    getDocs: jest.fn(),
    collection: jest.fn(),
    query: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
    startAfter: jest.fn(),
  };
});

describe('createFirebaseProvider', () => {
  const mockDoc = (id: string, data: Partial<Post>): Partial<QueryDocumentSnapshot> => ({
    id,
    data: () => data,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load first page and sets lastVisible', async () => {
    // GIVEN
    const mockSnapshot = {
      docs: [mockDoc('1', { id: '1', title: 'Post 1' }), mockDoc('2', { id: '2', title: 'Post 2' })],
    };

    (getDocs as jest.Mock).mockResolvedValueOnce(mockSnapshot);
    
    // WHEN
    const provider = createFirebaseProvider();
    const result = await provider.loadPage(1, 2);

    // THEN
    expect(getDocs).toHaveBeenCalled();
    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toBe('1');
    expect(result.canLoadMore).toBe(true);
  });

  it('should use lastVisible for pagination', async () => {
    // GIVEN
    const firstSnapshot = {
      docs: [mockDoc('1', { id: '1', title: 'Post 1' }), mockDoc('2', { id: '2', title: 'Post 2' })],
    };
    const secondSnapshot = {
      docs: [mockDoc('3', { id: '3', title: 'Post 3' }), mockDoc('4', { id: '4', title: 'Post 4' })],
    };

    (getDocs as jest.Mock)
      .mockResolvedValueOnce(firstSnapshot)
      .mockResolvedValueOnce(secondSnapshot);

    // WHEN
    const provider = createFirebaseProvider();

    // First page
    await provider.loadPage(1, 2);
    // Second page
    const result = await provider.loadPage(2, 2);

    // THEN
    expect(getDocs).toHaveBeenCalledTimes(2);
    expect(result.items[0].id).toBe('3');
    expect(result.items).toHaveLength(2);
  });

  it('should return canLoadMore = false when fewer items than pageSize', async () => {
    // GIVEN
    const mockSnapshot = {
      docs: [mockDoc('1', { title: 'Only Post' })],
    };

    (getDocs as jest.Mock).mockResolvedValueOnce(mockSnapshot);

    // WHEN
    const provider = createFirebaseProvider();
    const result = await provider.loadPage(1, 2);

    // THEN
    expect(result.canLoadMore).toBe(false);
  });
});
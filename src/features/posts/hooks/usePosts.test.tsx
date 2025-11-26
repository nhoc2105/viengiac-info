import * as firebaseProvider from '@/src/api/providers/firebase/firebase.provider';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Button, Text } from 'react-native';
import { Post } from '../post.types';
import { usePosts } from './usePosts';

jest.mock('@/src/api/providers/firebase/firebase.provider');

const mockLoadPage = jest.fn();

const mockPost = (id: string): Post => ({
  id,
  sourceId: 'firebase:posts',
  title: `Post ${id}`,
  url: `https://example.com/${id}`,
  publishedAt: new Date().toISOString(),
  author: [],
  imageUrl: '',
  summary: '',
  content: ''
});

function IntegrationComponent() {
  const { items, loading, error, refreshing, canLoadMore, refresh, loadMore } = usePosts();
  return (
    <>
      {items.map((item) => (
        <Text key={item.id} testID={`post-${item.id}`}>
          {item.title}
        </Text>
      ))}
      {loading && <Text testID="loading">Loading...</Text>}
      {error && <Text testID="error">{error}</Text>}
      <Button title="Refresh" onPress={refresh} testID="refresh-button" />
      {canLoadMore && (
        <Button title="Load More" onPress={loadMore} testID="load-more-button" />
      )}
      <Text testID="refreshing">{refreshing}</Text>
    </>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  (firebaseProvider.createFirebaseProvider as jest.Mock).mockReturnValue({
    id: 'firebase:posts',
    label: 'Firebase Posts',
    loadPage: mockLoadPage,
  });
});

describe('usePosts', () => {
  it('should render initial posts', async () => {
    // GIVEN
    mockLoadPage.mockResolvedValueOnce({
      items: [mockPost('1'), mockPost('2')],
      canLoadMore: true,
    });

    // WHEN
    const { getByTestId } = render(<IntegrationComponent />);
    await waitFor(() => getByTestId('post-1'));

    // THEN
    expect(getByTestId('post-1')).toBeTruthy();
    expect(getByTestId('post-2')).toBeTruthy();
  });

  
  it('should load more posts when "Load More" is pressed', async () => {
    // GIVEN
    mockLoadPage
      .mockResolvedValueOnce({
        items: [mockPost('1')],
        canLoadMore: true,
      })
      .mockResolvedValueOnce({
        items: [mockPost('2')],
        canLoadMore: false,
      });

    // WHEN
    const { getByTestId, queryByTestId } = render(<IntegrationComponent />);

    await waitFor(() => getByTestId('post-1'));

    fireEvent.press(getByTestId('load-more-button'));

    await waitFor(() => getByTestId('post-2'));

    // THEN
    expect(getByTestId('post-2')).toBeTruthy();
    expect(queryByTestId('load-more-button')).toBeNull(); // No more posts to load
  });

  it('should refresh posts when "Refresh" is pressed', async () => {
    // GIVEN
    mockLoadPage
      .mockResolvedValueOnce({
        items: [mockPost('1')],
        canLoadMore: true,
      })
      .mockResolvedValueOnce({
        items: [mockPost('99')],
        canLoadMore: true,
      });

    // WHEN render first post
    const { getByTestId, queryByTestId } = render(<IntegrationComponent />);
    await waitFor(() => getByTestId('post-1'));

    // AND when refresh
    fireEvent.press(getByTestId('refresh-button'));
    await waitFor(() => getByTestId('post-99'));

    // THEN
    expect(getByTestId('refreshing').props.children).toBe(false);
    expect(getByTestId('post-99')).toBeTruthy();
    expect(queryByTestId('post-1')).toBeNull(); // Old post should be gone
  });

  
  it('should display error message on failure', async () => {
    // GIVEN
    mockLoadPage.mockRejectedValueOnce(new Error('Something went wrong'));

    // WHEN
    const { getByTestId } = render(<IntegrationComponent />);

    await waitFor(() => getByTestId('error'));

    // THEN
    expect(getByTestId('error').props.children).toBe('Something went wrong');
  });
});
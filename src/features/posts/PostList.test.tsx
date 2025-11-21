import { usePosts } from '@/src/features/posts/hooks/usePosts';
import useNetworkStatus from '@/src/shared/hooks/useNetworkStatus';
import { fireEvent, render, RenderAPI, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import PostList from './PostList';

jest.mock('@/src/features/posts/hooks/usePosts');
jest.mock('@/src/shared/hooks/useNetworkStatus');
jest.mock('./PostItemSkeleton', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  // eslint-disable-next-line react/display-name
  return () => <View testID="MockSkeleton" />;
});
jest.mock('react-native-paper', () => {
  const actualPaper = jest.requireActual('react-native-paper');
  return {
    ...actualPaper,
    ActivityIndicator: (props: any) => <div {...props}>Mocked ActivityIndicator</div>,
  };
});
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

describe('PostList Component', () => {
  const mockRefresh = jest.fn();
  const mockLoadMore = jest.fn();

  const renderPostList = (): RenderAPI =>
    render(
      <PaperProvider>
        <PostList />
      </PaperProvider>
    );

  beforeEach(() => {
    (useNetworkStatus as jest.Mock).mockReturnValue(true);
  });

  test('should show loading skeleton when posts are loading', () => {
    // GIVEN posts are loading
    (usePosts as jest.Mock).mockReturnValue({
      items: [],
      loading: true,
      error: null,
      refreshing: false,
      canLoadMore: false,
      refresh: mockRefresh,
      loadMore: mockLoadMore,
    });

    // WHEN component renders
    const { getByTestId, getAllByTestId } = renderPostList();

    // THEN skeleton loader should be visible
    expect(getByTestId('SkeletonLoader')).toBeTruthy();
    expect(getAllByTestId('MockSkeleton').length).toBeGreaterThan(0);
  });

  test('should display list items when posts exist', async () => {
    // GIVEN posts exist
    (usePosts as jest.Mock).mockReturnValue({
      items: [{ id: 1, title: 'Post 1' }],
      loading: false,
      error: null,
      refreshing: false,
      canLoadMore: false,
      refresh: mockRefresh,
      loadMore: mockLoadMore,
    });

    // WHEN component renders
    render(<PostList />);

    // THEN post title should be visible
    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeTruthy();

    });
  });

  test('should show error banner when error exists', async () => {
    // GIVEN error exists
    (usePosts as jest.Mock).mockReturnValue({
      items: [],
      loading: false,
      error: 'Something went wrong',
      refreshing: false,
      canLoadMore: false,
      refresh: mockRefresh,
      loadMore: mockLoadMore,
    });
    (useNetworkStatus as jest.Mock).mockReturnValue(true);

    // WHEN component renders
    const { getByTestId, queryByTestId } = renderPostList();

    // THEN error message should be visible
    await waitFor(() => {
      expect(getByTestId('DialogError')).toBeTruthy();
      expect(queryByTestId('DialogNoInternet')).toBeFalsy();
    });
  });

  test('should call loadMore when onEndReached triggers and canLoadMore is true', async () => {
    // GIVEN canLoadMore is true
    (usePosts as jest.Mock).mockReturnValue({
      items: [{ id: 1, title: 'Post 1' }],
      loading: false,
      error: null,
      refreshing: false,
      canLoadMore: true,
      refresh: mockRefresh,
      loadMore: mockLoadMore,
    });

    // WHEN onEndReached is fired
    const { getByTestId } = renderPostList();
    const flatList = getByTestId('FlatList');
    fireEvent(flatList, 'onEndReached');

    // THEN loadMore should be called
    await waitFor(() => expect(mockLoadMore).toHaveBeenCalled());
  });

  it('should show network dialog when offline', async () => {
    // GIVEN
    (usePosts as jest.Mock).mockReturnValue({
      items: [],
      loading: false,
      error: null,
      refreshing: false,
      canLoadMore: false,
      refresh: mockRefresh,
      loadMore: mockLoadMore,
    });
    (useNetworkStatus as jest.Mock).mockReturnValue(false);

    // WHEN
    const { getByTestId, queryByTestId } = renderPostList();

    // THEN
    await waitFor(() => {
      expect(queryByTestId('DialogError')).toBeFalsy();
      expect(getByTestId('DialogNoInternet')).toBeTruthy();
    });
  });
});

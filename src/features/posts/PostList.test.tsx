import { usePosts } from '@/src/features/posts/hooks/usePosts';
import useNetworkStatus from '@/src/shared/hooks/useNetworkStatus';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import PostList from './PostList';

jest.mock('@/src/features/posts/hooks/usePosts');
jest.mock('@/src/shared/hooks/useNetworkStatus');
jest.mock('./PostItemSkeleton', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  // eslint-disable-next-line react/display-name
  return () => <View testID="MockSkeleton" />;
});
jest.mock('@/src/shared/components/basic/simple-dialog/SimpleDialog', () => {
  return ({ title }: { title: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { View } = require('react-native');
    // eslint-disable-next-line react/display-name
    return <View testID={`MockDialog-${title}`} />;
  };
});

jest.mock('./PostItemSkeleton', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  // eslint-disable-next-line react/display-name
  return () => <View testID="MockSkeleton" />;
});

describe('PostList Component', () => {
  const mockRefresh = jest.fn();
  const mockLoadMore = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
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
    const { getByTestId, getAllByTestId } = render(<PostList />);

    // THEN skeleton loader should be visible
    expect(getByTestId('SkeletonLoader')).toBeTruthy();
    expect(getAllByTestId('MockSkeleton').length).toBeGreaterThan(0);
  });

  test('should display list items when posts exist', () => {
    // GIVEN posts exist
    (usePosts as jest.Mock).mockReturnValue({
      items: [{ id: 1, title: 'Post 1' }],
      loading: false,
      error: null,
      refreshing: false,
      canLoadMore: true,
      refresh: mockRefresh,
      loadMore: mockLoadMore,
    });

    // WHEN component renders
    const { getByText } = render(<PostList />);

    // THEN post title should be visible
    expect(getByText('Post 1')).toBeTruthy();
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
    const { getByTestId, queryByTestId } = render(<PostList />);

    // THEN error message should be visible
    await waitFor(() => {
      expect(getByTestId('MockDialog-Unable to load articles')).toBeTruthy();
      expect(queryByTestId('MockDialog-No internet connection')).toBeFalsy();
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
    const { getByTestId } = render(<PostList />);
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
    const { getByTestId, queryByTestId } = render(<PostList />);

    // THEN
    await waitFor(() => {
      expect(queryByTestId('MockDialog-Unable to load articles')).toBeFalsy();
      expect(getByTestId('MockDialog-No internet connection')).toBeTruthy();
    });
  });
});

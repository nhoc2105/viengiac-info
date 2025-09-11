import { usePosts } from '@/src/features/posts/hooks/usePosts';
import { act, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

// Mock feed class
const mockNext = jest.fn();
const mockReset = jest.fn();

jest.mock('@/src/api/providers/aggregated-post-feed', () => ({
  AggregatedPostFeed: jest.fn().mockImplementation(() => ({
    next: mockNext,
    reset: mockReset,
  })),
}));

// Mock providers & page size constants to avoid side-effects
jest.mock('@/src/api/providers', () => ({ providers: [] }));
jest.mock('@/src/constants/config.const', () => ({ PAGE_SIZE: 2 }));

// Integration component to test the hook
function IntegrationComponent() {
  const { items, loading, error, refreshing, canLoadMore, refresh, loadMore } = usePosts();
  // Expose minimal state via text for assertions
  return (
    <>
      <Text testID="items-count">{String(items.length)}</Text>
      <Text testID="loading">{String(loading)}</Text>
      <Text testID="error">{error ?? ''}</Text>
      <Text testID="refreshing">{String(refreshing)}</Text>
      <Text testID="canLoadMore">{String(canLoadMore)}</Text>
      <Text onPress={() => refresh()} testID="do-refresh">refresh</Text>
      <Text onPress={() => loadMore()} testID="do-load-more">loadMore</Text>
    </>
  );
}

describe('usePosts', () => {
  beforeEach(() => {
    mockNext.mockReset();
    mockReset.mockReset();
  });

  it('should refresh on mount, load items, and update flags', async () => {
    // GIVEN
    mockNext.mockResolvedValueOnce({ items: [{ id: 'a', sourceId: 's', title: 't', url: 'u', publishedAt: '2025-01-01' }], canLoadMore: true });
    
    // WHEN
    render(<IntegrationComponent />);

    // THEN
    await waitFor(() => expect(screen.getByTestId('items-count').children.join('')).toBe('1'));
    expect(screen.getByTestId('loading').children.join('')).toBe('false');
    expect(screen.getByTestId('error').children.join('')).toBe('');
    expect(screen.getByTestId('canLoadMore').children.join('')).toBe('true');
    expect(mockReset).toHaveBeenCalled();
  });

  it('should add more items when load more allowed', async () => {
    // GIVEN
    mockNext.mockResolvedValueOnce({ items: [{ id: 'a', sourceId: 's', title: 't', url: 'u', publishedAt: '2025-01-01' }], canLoadMore: true });
    
    // WHEN
    const { getByTestId } = render(<IntegrationComponent />);

    // THEN
    await waitFor(() => expect(getByTestId('items-count').children.join('')).toBe('1'));

    // GIVEN
    mockNext.mockResolvedValueOnce({ items: [{ id: 'b', sourceId: 's', title: 't2', url: 'u2', publishedAt: '2025-01-02' }], canLoadMore: false });
    
    // THEN
    await act(async () => { getByTestId('do-load-more').props.onPress(); });
    await waitFor(() => expect(getByTestId('items-count').children.join('')).toBe('2'));
    expect(getByTestId('canLoadMore').children.join('')).toBe('false');
  });

  it('should capture errors from next()', async () => {
    // GIVEN
    mockNext.mockRejectedValueOnce(new Error('boom'));

    // WHEN
    render(<IntegrationComponent />);

    // THEN
    await waitFor(() => expect(screen.getByTestId('error').children.join('')).toBe('boom'));
  });
});

import { render } from '@testing-library/react-native';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import PostItemSkeleton from './PostItemSkeleton';

// Mock SkeletonShimmer to simplify testing
jest.mock('@/src/shared/components/basic/skeleton-shimmer/SkeletonShimmer', () => {
  // eslint-disable-next-line react/display-name
  return ({ testID }: { testID?: string }) => <></>;
});

describe('PostItemSkeleton', () => {
  const renderComponent = () =>
    render(
      <PaperProvider>
        <PostItemSkeleton testID='post-item-skeleton' />
      </PaperProvider>
    );

  it('should render without crashing', () => {
    // WHEN
    const { getByTestId } = renderComponent();

    // THEN
    expect(getByTestId('post-item-skeleton')).toBeTruthy();
  });
});
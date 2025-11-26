
import PostDetails from '@/src/features/posts/post-details/PostDetails';
import PostStorageService from '@/src/features/posts/services/post-storage.service';
import { paperTheme } from '@/src/theme/paper';
import { render } from '@testing-library/react-native';
import React from 'react';
import { PaperProvider } from 'react-native-paper';

// Mock PostStorageService
jest.mock('@/src/features/posts/services/post-storage.service');

// Mock timeAgoLong
jest.mock('@/src/utils/date-time.utils', () => ({
  timeAgoLong: jest.fn(() => '10 days ago')
}));

const mockPost = {
  id: '1',
  title: 'Hello &amp; <em>world</em>',
  publishedAt: '2025-01-01T00:00:00Z',
  author: ['Max', 'Anna'],
  content: '<p>Paragraph 1</p><br>image.jpg',
  imageUrl: '',
  sourceId: 'VG',
  summary: '',
  url: 'https://example.com'
};

describe('PostDetails', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render post details with title and metadata', () => {
    // GIVEN a selected post
    (PostStorageService.getInstance as jest.Mock).mockReturnValue({
      getSelectedPost: () => mockPost
    });

    // WHEN component is rendered
    const { getByTestId } = render(
      <PaperProvider theme={paperTheme}>
        <PostDetails />
      </PaperProvider>
    );

    // THEN title and metadata should be displayed
    expect(getByTestId('post-title').props.children).toBe('Hello & <em>world</em>');
    expect(getByTestId('post-meta').props.children.join('')).toContain('10 days ago');
    expect(getByTestId('post-meta').props.children.join('')).toContain('Max, Anna');
  });

  it('should render HTML chunks in FlatList', () => {
    // GIVEN a selected post with HTML content
    (PostStorageService.getInstance as jest.Mock).mockReturnValue({
      getSelectedPost: () => mockPost
    });

    // WHEN component is rendered
    const { getByTestId } = render(
      <PaperProvider theme={paperTheme}>
        <PostDetails />
      </PaperProvider>
    );

    // THEN FlatList and first chunk should be visible
    expect(getByTestId('post-content-list')).toBeTruthy();
    expect(getByTestId('post-chunk-0')).toBeTruthy();
  });

  it('should return null when no post is selected', () => {
    // GIVEN no selected post
    (PostStorageService.getInstance as jest.Mock).mockReturnValue({
      getSelectedPost: () => undefined
    });

    // WHEN component is rendered
    const { queryByTestId } = render(
      <PaperProvider theme={paperTheme}>
        <PostDetails />
      </PaperProvider>
    );

    // THEN nothing should be rendered
    expect(queryByTestId('post-title')).toBeNull();
    expect(queryByTestId('post-content-list')).toBeNull();
  });
});
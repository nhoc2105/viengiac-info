import PostDetails from '@/src/features/posts/post-details/PostDetails';
import PostStorageService from '@/src/features/posts/services/post-storage.service';
import { paperTheme } from '@/src/theme/paper';
import { render } from '@testing-library/react-native';
import React from 'react';
import { PaperProvider } from 'react-native-paper';

// Mock PostStorageService
jest.mock('@/src/features/posts/services/post-storage.service');

jest.mock('@/src/utils/date-time.utils', () => ({
  timeAgoLong: jest.fn(() => '10 days ago')
}));

jest.mock('./html-renderer/IframeRenderer', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  // eslint-disable-next-line react/display-name
  return () => <View testID="mock-iframe-renderer" />;
});

jest.mock('./html-renderer/AudioRenderer', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  // eslint-disable-next-line react/display-name
  return () => <View testID="mock-audio-renderer" />;
});

jest.mock('./html-renderer/VideoRenderer', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  // eslint-disable-next-line react/display-name
  return () => <View testID="mock-video-renderer" />;
});

const mockPostWithImage = {
  id: '1',
  title: 'Post with Image',
  publishedAt: '2025-01-01T00:00:00Z',
  author: ['Max'],
  content: '<audio src="a.mp3"/><img src="https://example.com/test.jpg" width="200" height="100"/>',
  summary: '',
  url: 'https://example.com'
};

describe('PostDetails Integration', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render ImageRenderer for <img> tags in content', async () => {
    // GIVEN a post with an <img> tag
    (PostStorageService.getInstance as jest.Mock).mockReturnValue({
      getSelectedPost: () => mockPostWithImage
    });

    // WHEN PostDetails is rendered
    const { getByTestId } = render(
      <PaperProvider theme={paperTheme}>
        <PostDetails />
      </PaperProvider>
    );

    // THEN
    const imageRenderer = getByTestId('image-renderer');
    expect(imageRenderer.props.source[0].uri).toBe('https://example.com/test.jpg');

    const audioRenderer = getByTestId('mock-audio-renderer');
    expect(audioRenderer).toBeTruthy();
  });
});

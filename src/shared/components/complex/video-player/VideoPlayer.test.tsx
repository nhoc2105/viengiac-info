
import { render } from '@testing-library/react-native';
import React from 'react';
import VideoPlayer from './VideoPlayer';

// Mock expo-video hooks and components
jest.mock('expo-video', () => ({
  useVideoPlayer: jest.fn(() => ({ /* mock player object */ })),
  VideoView: (props: any) => {
    return <div testID="video-view" {...props} />;
  },
}));

describe('VideoPlayer Component', () => {
  it('should render VideoView with correct width and height', () => {
    // GIVEN / WHEN
    const { getByTestId } = render(
      <VideoPlayer source="https://example.com/video.mp4" width={300} height={200} />
    );

    // THEN
    const videoView = getByTestId('video-view');
    expect(videoView.props.style.width).toBe(300);
    expect(videoView.props.style.height).toBe(200);
  });

  it('should pass the source to useVideoPlayer', () => {
    // GIVEN
    const mockUseVideoPlayer = require('expo-video').useVideoPlayer;

    // WHEN
    render(<VideoPlayer source="https://example.com/video.mp4" width={300} height={200} />);

    // THEN
    expect(mockUseVideoPlayer).toHaveBeenCalledWith(
      'https://example.com/video.mp4',
      expect.any(Function)
    );
  });
});

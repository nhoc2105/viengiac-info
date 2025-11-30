
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import React from 'react';
import AudioPlayer from './AudioPlayer';

// Mock dependencies
jest.mock('expo-audio', () => ({
  useAudioPlayer: jest.fn(),
  useAudioPlayerStatus: jest.fn(),
  setAudioModeAsync: jest.fn(),
}));

jest.mock('@/src/utils/date-time.utils', () => ({
  formatDuration: (value: number) => `${value}s`,
}));

describe('AudioPlayer Component', () => {
  const mockPlay = jest.fn();
  const mockPause = jest.fn();
  const mockSeekTo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAudioPlayer as jest.Mock).mockReturnValue({
      play: mockPlay,
      pause: mockPause,
      seekTo: mockSeekTo,
    });
  });

  it('should render with initial state', async () => {
    // Given
    (useAudioPlayerStatus as jest.Mock).mockReturnValue({
      playing: false,
      duration: 120,
      currentTime: 0,
    });

    // When
    const { getByText } = render(<AudioPlayer source="test.mp3" />);

    // Then
    await waitFor(() => expect(getByText('0s / 120s')).toBeTruthy());
  });

  it('should toggle play and pause when TouchableOpacity is pressed', () => {
    // Given
    (useAudioPlayerStatus as jest.Mock).mockReturnValue({
      playing: false,
      duration: 120,
      currentTime: 0,
    });

    const { getByTestId, rerender } = render(<AudioPlayer source="test.mp3" />);
    const playPauseControl = getByTestId('play-pause-control');

    // When
    fireEvent.press(playPauseControl);

    // Then
    expect(mockPlay).toHaveBeenCalled();

    // Given (update status to playing)
    (useAudioPlayerStatus as jest.Mock).mockReturnValue({
      playing: true,
      duration: 120,
      currentTime: 0,
    });

    rerender(<AudioPlayer source="test.mp3" />);

    // When
    fireEvent.press(playPauseControl);

    // Then
    expect(mockPause).toHaveBeenCalled();
  });
});

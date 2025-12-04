import { formatDuration } from '@/src/utils/date-time.utils';
import { FontAwesome6 } from '@expo/vector-icons';
import { Slider } from '@react-native-assets/slider';
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

type AudioPlayerProps = {
  source: string; 
  contentWidth: number;
};

export default function AudioPlayer({ source, contentWidth }: AudioPlayerProps) {
  const player = useAudioPlayer(source, { updateInterval: 500 });
  const status = useAudioPlayerStatus(player);
  const theme = useTheme();

  const [seeking, setSeeking] = useState(false);
  const [pendingSeek, setPendingSeek] = useState<number | null>(null);
  const [resumeAfterSeek, setResumeAfterSeek] = useState(false);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  const duration = status?.duration ?? 0;
  const currentTime =
    seeking && pendingSeek !== null ? pendingSeek : status?.currentTime ?? 0;

  const playPause = async () => {
    if (status?.playing) {
      player.pause();
    } else {
      if (duration > 0 && currentTime >= duration - 0.05) {
        await player.seekTo(0);
      }
      player.play();
    }
  };

  const onSlidingStart = () => {
    setResumeAfterSeek(Boolean(status?.playing));
    setSeeking(true);
    player.pause();
  };
  const onValueChange = (value: number) => setPendingSeek(value);
  const onSlidingComplete = async (value: number) => {
    setSeeking(false);
    setPendingSeek(null);
    await player.seekTo(value);
    if (resumeAfterSeek) player.play();
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 32,
        backgroundColor: theme.colors.surfaceVariant,
        paddingHorizontal: 32,
        paddingVertical: 8,
        marginVertical: 4,
      }}>
      <TouchableOpacity
        testID='play-pause-control'
        style={{
          flex: 1, 
          marginEnd: 8,
        }}
        onPress={playPause}>
        {
          status?.playing 
            ? <FontAwesome6 name='pause' size={24} color={theme.colors.primary} />
            : <FontAwesome6 name='play' size={24} color={theme.colors.primary} />
        }
      </TouchableOpacity>
      <Text
        style={{
          flex: 5,
          marginStart: 4,
        }}
      >{formatDuration(currentTime)} / {formatDuration(duration)}</Text>  
      <Slider
        testID='slider'
        style={{ flex: 6, height: 40 }}
        thumbSize={15}
        minimumValue={0}
        maximumValue={duration || 0}
        value={currentTime}
        minimumTrackTintColor={theme.colors.primary}
        maximumTrackTintColor={theme.colors.secondaryContainer}
        thumbTintColor={theme.colors.primary}
        onSlidingStart={onSlidingStart}
        onValueChange={onValueChange}
        onSlidingComplete={onSlidingComplete}
      />
    </View>
  );
}
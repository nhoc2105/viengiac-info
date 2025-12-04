import AudioPlayer from '@/src/shared/components/complex/audio-player/AudioPlayer';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { RendererProps } from './CustomHtmlRenderers';

export default function AudioRenderer({ tnode, contentWidth }: RendererProps) {
  const sources = useMemo(() => {
    return (tnode.children ?? [])
      .filter(child => child.tagName === 'source')
      .map(child => child.attributes?.src)
      .filter(Boolean);
  }, [tnode]);

  // Determine the video source: prefer direct src, fallback to first source
  const source = tnode.attributes?.src || sources[0];

  return (
    <View testID="audio-renderer">
      {source ? <AudioPlayer source={source} contentWidth={contentWidth} /> : null}
    </View>
  );
}

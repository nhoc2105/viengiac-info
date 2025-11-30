import AudioPlayer from '@/src/shared/components/complex/audio-player/AudioPlayer';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { RendererProps } from './CustomHtmlRenderers';

export default function AudioRenderer({ tnode }: RendererProps) {
  const sources = useMemo(() => {
    return (tnode.children ?? [])
      .filter(child => child.tagName === 'source')
      .map(child => child.attributes?.src)
      .filter(Boolean);
  }, [tnode]);

  return (
    <View>
      {sources.map((src, idx) => (
        <AudioPlayer key={`${src}-${idx}`} source={src} />
      ))}
    </View>
  );
}

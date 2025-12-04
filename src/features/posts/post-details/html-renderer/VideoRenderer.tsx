
import VideoPlayer from '@/src/shared/components/complex/video-player/VideoPlayer';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { RendererProps } from './CustomHtmlRenderers';

export default function VideoRenderer({ tnode, contentWidth }: RendererProps) {
  // Extract all <source> tags' src attributes
  const sources = useMemo(() => {
    return (tnode.children ?? [])
      .filter(child => child.tagName === 'source')
      .map(child => child.attributes?.src)
      .filter(Boolean) as string[];
  }, [tnode]);

  // Determine the video source: prefer direct src, fallback to first source
  const source = tnode.attributes?.src || sources[0];

  // Compute aspect ratio from tag attributes if available
  const tagWidth = parseFloat(tnode.attributes?.width || '');
  const tagHeight = parseFloat(tnode.attributes?.height || '');
  const aspectRatio = tagWidth > 0 && tagHeight > 0 ? tagWidth / tagHeight : 16 / 9;

  // Compute height based on contentWidth and aspect ratio
  const computedHeight = contentWidth / aspectRatio;

  return (
    <View testID="video-renderer">
      {source && <VideoPlayer source={source} width={contentWidth} height={computedHeight} />}
    </View>
  );
}

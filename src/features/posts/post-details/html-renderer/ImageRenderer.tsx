
// src/components/renderers/ImageRenderer.tsx
import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { useTheme } from 'react-native-paper';
import { useIMGElementProps } from 'react-native-render-html';
import { RendererProps } from './CustomHtmlRenderers';

export default function ImageRenderer({ contentWidth, ...props }: RendererProps) {
  const imgElementProps = useIMGElementProps(props);
  const uri = imgElementProps.source.uri;
  const theme = useTheme();
  const placeholder = theme.dark 
    ? require('@/assets/images/logo-dark.svg')
    : require('@/assets/images/logo-light.svg')

    
const aspectRatio = useMemo(() => {
    const w = Number(imgElementProps.width);
    const h = Number(imgElementProps.height);
    return w && h ? w / h : 1;
  }, [imgElementProps.width, imgElementProps.height]);

  const style = useMemo(
    () => [{ marginBottom: 8, width: contentWidth, aspectRatio }],
    [contentWidth, aspectRatio]
  );

  return (
    <Image
      testID="image-renderer"
      style={style}
      source={uri}
      cachePolicy="disk"
      placeholder={placeholder}
      contentFit="cover"
    />
  );
}

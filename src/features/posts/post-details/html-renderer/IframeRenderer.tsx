import AutoHeightWebView from '@/src/shared/components/complex/AutoHeightWebView';
import React from 'react';
import { CustomRendererProps, TBlock } from 'react-native-render-html';

interface IframeRendererProps extends CustomRendererProps<TBlock> {
  contentWidth: number;
}

/**
 * Renders an <iframe> inside React Native using WebView.
 * Height defaults to contentWidth / 2. Uses a loading overlay.
 */
export default function IframeRenderer({ tnode, contentWidth }: IframeRendererProps) {
  const src = tnode.attributes.src;

  return (
    <AutoHeightWebView uri={src}/>
  );
}

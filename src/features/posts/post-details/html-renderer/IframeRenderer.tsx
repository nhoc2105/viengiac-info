import AutoHeightWebView from '@/src/shared/components/complex/auto-height-webview/AutoHeightWebView';
import React from 'react';
import { RendererProps } from './CustomHtmlRenderers';

/**
 * Renders an <iframe> inside React Native using WebView.
 * Height defaults to contentWidth / 2. Uses a loading overlay.
 */
export default function IframeRenderer({ tnode, contentWidth }: RendererProps) {
  const src = tnode.attributes.src;

  return (
    <AutoHeightWebView uri={src}/>
  );
}

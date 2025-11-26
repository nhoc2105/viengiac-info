
import React from 'react';
import { CustomRendererProps, TBlock } from 'react-native-render-html';
import ImageRenderer from './ImageRenderer';

export const HtmlRenderers = (contentWidth: number) => ({
  img: (props: CustomRendererProps<TBlock>) => (
    <ImageRenderer {...props} contentWidth={contentWidth} />
  ),
});

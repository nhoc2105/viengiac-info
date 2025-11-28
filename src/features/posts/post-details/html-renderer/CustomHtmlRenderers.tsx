
import React from 'react';
import { CustomRendererProps, HTMLContentModel, HTMLElementModel, TBlock } from 'react-native-render-html';
import IframeRenderer from './IframeRenderer';
import ImageRenderer from './ImageRenderer';

export const CustomHtmlRenderers = (contentWidth: number) => ({
  img: (props: CustomRendererProps<TBlock>) => (
    <ImageRenderer {...props} contentWidth={contentWidth} />
  ),
  
  iframe: (props: CustomRendererProps<TBlock>) => (
    <IframeRenderer {...props} contentWidth={contentWidth} />
  ),

});

export const customHtmlModels = {
  iframe: HTMLElementModel.fromCustomModel({
    tagName: 'iframe',
    contentModel: HTMLContentModel.mixed
  })
};


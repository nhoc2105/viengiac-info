
import React from 'react';
import { CustomRendererProps, HTMLContentModel, HTMLElementModel, TBlock } from 'react-native-render-html';
import AudioRenderer from './AudioRenderer';
import IframeRenderer from './IframeRenderer';
import ImageRenderer from './ImageRenderer';

export interface RendererProps extends CustomRendererProps<TBlock> {
  contentWidth: number;
}

export const CustomHtmlRenderers = (contentWidth: number) => ({
  img: (props: CustomRendererProps<TBlock>) => (
    <ImageRenderer {...props} contentWidth={contentWidth} />
  ),
  
  iframe: (props: CustomRendererProps<TBlock>) => (
    <IframeRenderer {...props} contentWidth={contentWidth} />
  ),

  audio: (props: CustomRendererProps<TBlock>) => (
    <AudioRenderer {...props} contentWidth={contentWidth} />
  ),
  source: () => null // Prevent removal of <source>

});

export const customHtmlModels = {
  iframe: HTMLElementModel.fromCustomModel({
    tagName: 'iframe',
    contentModel: HTMLContentModel.mixed
  }),
  audio: HTMLElementModel.fromCustomModel({
    tagName: 'audio',
    contentModel: HTMLContentModel.mixed
  }),
};


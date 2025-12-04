
import React from 'react';
import { CustomRendererProps, HTMLContentModel, HTMLElementModel, TBlock } from 'react-native-render-html';
import AudioRenderer from './AudioRenderer';
import IframeRenderer from './IframeRenderer';
import ImageRenderer from './ImageRenderer';
import VideoRenderer from './VideoRenderer';

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
  video: (props: CustomRendererProps<TBlock>) => (
    <VideoRenderer {...props} contentWidth={contentWidth} />
  ),

});

export const customHtmlModels = {
  iframe: HTMLElementModel.fromCustomModel({
    tagName: 'iframe',
    contentModel: HTMLContentModel.block
  }),
  audio: HTMLElementModel.fromCustomModel({
    tagName: 'audio',
    contentModel: HTMLContentModel.block
  }),
  video: HTMLElementModel.fromCustomModel({
    tagName: 'audio',
    contentModel: HTMLContentModel.block
  }),
};


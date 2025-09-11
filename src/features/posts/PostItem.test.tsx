import { paperTheme } from '@/src/theme/paper';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Linking } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import PostItem from './PostItem';

jest.mock('@/src/utils/date-time.utils', () => ({ timeAgo: () => '5m ago' }));

const post = {
  id: 'wp:site:1',
  sourceId: 'wp:site',
  sourceName: 'Site',
  title: 'Hello &amp; <em>world</em>',
  url: 'https://example.com',
  publishedAt: '2025-01-01T00:00:00Z',
};

describe('PostItem', () => {
  it('should render title, meta, and opens on press', async () => {
    // GIVEN
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValueOnce(true as any);

    // WHEN
    const { getByText } = render(
      <PaperProvider theme={paperTheme}><PostItem article={post as any} /></PaperProvider>
    );

    // THEN
    // Decoded & stripped title should still contain text 'Hello & <em>world</em>' -> decodeHtmlEntities on whole string
    getByText('Hello & <em>world</em>');
    getByText('Site · 5m ago');

    // WHEN
    fireEvent.press(getByText('Hello & <em>world</em>'));

    // THEN
    expect(open).toHaveBeenCalledWith('https://example.com');
  });

  it('should show cover image when imageUrl present else placeholder', () => {
    // GIVEN
    const imageUrl = 'https://img';

    // WHEN
    const { rerender, getByTestId } = render(
      <PaperProvider theme={paperTheme}><PostItem article={{...post as any, imageUrl: imageUrl}} /></PaperProvider>
    );

    // THEN
    const image = getByTestId('cover-image');
    expect(image.props.source).toEqual({ uri: imageUrl });

    // GIVEN
    const imageUrlUndefined = undefined;
    
    // WHEN
    rerender(<PaperProvider theme={paperTheme}><PostItem article={{...post as any, imageUrl: imageUrlUndefined}} /></PaperProvider>);
    
    // THEN
    expect(() => getByTestId('cover-image')).toThrow();
    getByTestId('placeholder-image');
  });
});

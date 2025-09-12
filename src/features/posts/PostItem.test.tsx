import { paperTheme } from '@/src/theme/paper';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React, { act } from 'react';
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
      <PaperProvider theme={paperTheme}><PostItem post={post as any} /></PaperProvider>
    );

    // THEN
    await waitFor(() => {
      expect(screen.getByText('Hello & <em>world</em>')).toBeTruthy();
      expect(screen.getByText('Site · 5m ago')).toBeTruthy();
    });


    // WHEN
    await act(() => {
      fireEvent.press(getByText('Hello & <em>world</em>'))
    });

    // THEN
    await waitFor(() => expect(open).toHaveBeenCalledWith('https://example.com'));
  });

  it('should show cover image when imageUrl present else placeholder', async () => {
    // GIVEN
    const imageUrl = 'https://img';

    // WHEN
    const { rerender, getByTestId } = render(
      <PaperProvider theme={paperTheme}><PostItem post={{...post as any, imageUrl: imageUrl}} /></PaperProvider>
    );

    // THEN
    const image = getByTestId('cover-image');
    expect(image.props.source).toEqual({ uri: imageUrl });

    // GIVEN
    const imageUrlUndefined = undefined;
    
    // WHEN
    await act(async () => {
      rerender(
        <PaperProvider theme={paperTheme}>
          <PostItem post={{ ...post as any, imageUrl: imageUrlUndefined }} />
        </PaperProvider>
      );
    });

    // THEN
    await waitFor(() => {
      expect(screen.queryByTestId('cover-image')).toBeNull();
      expect(screen.getByTestId('placeholder-image')).toBeTruthy();
    });
  });
});

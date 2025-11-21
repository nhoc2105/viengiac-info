import i18n from '@/src/i18n';
import { paperTheme } from '@/src/theme/paper';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React, { act } from 'react';
import { PaperProvider } from 'react-native-paper';
import PostItem from './PostItem';
import { Post } from './post.types';


const mockRouterPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

const post: Post = {
  id: '1',
  sourceId: 'VG',
  title: 'Hello &amp; <em>world</em>',
  url: 'https://example.com',
  publishedAt: '2025-01-01T00:00:00Z',
  author: ["Max", "Anna"],
  imageUrl: '',
  summary: '',
  content: '',
};

describe('PostItem', () => {
  beforeAll(() => {
    i18n.changeLanguage('vi');
  });

  it('should render post', async () => {
    // GIVEN

    // WHEN
    render(
      <PaperProvider theme={paperTheme}><PostItem post={post as any} /></PaperProvider>
    );

    // THEN
    await waitFor(() => {
      expect(screen.getByText('Hello & <em>world</em>')).toBeTruthy();
      expect(screen.getByText('Tổ Đình Viên Giác 🇩🇪 · 10 tháng')).toBeTruthy();
    });
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

  it('should navigate to details page on press', async () => {
    // GIVEN
    render(
      <PaperProvider theme={paperTheme}>
        <PostItem post={post as any} />
      </PaperProvider>
    );

    // WHEN
    const button = screen.getByRole('button', { name: /Hello &/i });
    fireEvent.press(button);

    // THEN
    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith({
        pathname: '/post/details',
        params: { id: post.id },
      });
    });
  });
});

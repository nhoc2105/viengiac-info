import LoadingFooter from '@/src/components/loading-footer/LoadingFooter';
import { paperTheme } from '@/src/theme/paper';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React, { act } from 'react';
import { PaperProvider } from 'react-native-paper';

describe('LoadingFooter', () => {
  it('should render spinner when loading', async () => {
    // WHEN
    const { unmount } = render(
      <PaperProvider theme={paperTheme}><LoadingFooter loading={true} canLoadMore={true} onLoadMore={() => {}} /></PaperProvider>
    );

    // THEN
    await waitFor(() => expect(screen.getByTestId('activity-indicator')).toBeTruthy());
    await unmount();

  });

  it('should render end text when cannot load more', () => {
    // WHEN
    const { getByText } = render(
      <PaperProvider theme={paperTheme}><LoadingFooter loading={false} canLoadMore={false} onLoadMore={() => {}} /></PaperProvider>
    );

    // THEN
    getByText(/— End —/);
  });

  it('should render button and handle press', async() => {
    // GIVEN
    const onPress = jest.fn();

    // WHEN
    const { getByText } = render(
      <PaperProvider theme={paperTheme}><LoadingFooter loading={false} canLoadMore onLoadMore={onPress} /></PaperProvider>
    );

    await act(() => fireEvent.press(getByText('Load more')));

    // THEN
    expect(onPress).toHaveBeenCalled();
  });
});

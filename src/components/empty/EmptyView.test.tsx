import EmptyView from '@/src/components/empty/EmptyView';
import { paperTheme } from '@/src/theme/paper';
import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { PaperProvider } from 'react-native-paper';

describe('EmptyView', () => {
  it('should render default text and custom title', async () => {
    // GIVEN / WHEN
    const { getByText, rerender } = render(<PaperProvider theme={paperTheme}><EmptyView /></PaperProvider>);

    // THEN
    getByText('No posts yet.');

    // WHEN
    rerender(<PaperProvider theme={paperTheme}><EmptyView title="Nothing here" /></PaperProvider>);

    // THEN
    await waitFor(() => getByText('Nothing here'));
  });
});

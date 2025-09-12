import ErrorView from '@/src/components/error/ErrorView';
import { paperTheme } from '@/src/theme/paper';
import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { PaperProvider } from 'react-native-paper';

describe('ErrorView', () => {
  it('should show error message', async () => {
    // GIVEN / WHEN
    const { getByText } = render(
      <PaperProvider theme={paperTheme}><ErrorView message="Oops" /></PaperProvider>
    );

    // THEN
    await waitFor(() => getByText('Something went wrong'));
    await waitFor(() => getByText('Oops'));
  });
});

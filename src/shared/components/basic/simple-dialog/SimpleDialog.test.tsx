import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import SimpleDialog from './SimpleDialog';

describe('SimpleDialog Integration Test', () => {
  const title = 'Test Dialog';
  const message = 'This is a test message';
  const primaryLabel = 'Retry';
  const secondaryLabel = 'Cancel';

  const onPrimaryAction = jest.fn();
  const onSecondaryAction = jest.fn();

  const renderWithProvider = (props: any) =>
    render(
      <PaperProvider>
        <SimpleDialog {...props} />
      </PaperProvider>
    );

  it('should render correctly when visible', async () => {
    // WHEN
    const { getByText } = renderWithProvider({
      visible: true,
      title,
      message,
      primaryLabel,
      secondaryLabel,
      onPrimaryAction,
      onSecondaryAction,
    });

    // THEN
    await waitFor(() => {
      expect(getByText(title)).toBeTruthy();
      expect(getByText(message)).toBeTruthy();
      expect(getByText(primaryLabel)).toBeTruthy();
      expect(getByText(secondaryLabel)).toBeTruthy();
    })
  });

  it('should call correct actions when buttons are pressed', async () => {
    // GIVEN
    const { getByText } = renderWithProvider({
      visible: true,
      title,
      message,
      primaryLabel,
      secondaryLabel,
      onPrimaryAction,
      onSecondaryAction,
    });

    // WHEN
    fireEvent.press(getByText(primaryLabel));

    // THEN
    await waitFor(() => {
      expect(onPrimaryAction).toHaveBeenCalledTimes(1);
    })

    // WHEN
    fireEvent.press(getByText(secondaryLabel));

    // THEN
    await waitFor(() => {
      expect(onSecondaryAction).toHaveBeenCalledTimes(1);
    })
  });

  it('should not render when visible is false', async () => {
    // WHEN
    const { queryByText } = renderWithProvider({
      visible: false,
      title,
      message,
      primaryLabel,
      secondaryLabel,
      onPrimaryAction,
      onSecondaryAction,
    });

    // THEN
    await waitFor(() => {
      expect(queryByText(title)).toBeNull();
      expect(queryByText(message)).toBeNull();
    })
  });
});
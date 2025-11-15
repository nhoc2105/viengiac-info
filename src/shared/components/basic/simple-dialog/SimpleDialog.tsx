import React from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

interface SimpleDialogProps {
  visible: boolean;
  title: string;
  message: string;
  icon?: IconSource;
  primaryLabel: string;      // e.g., Retry
  secondaryLabel: string;    // e.g., Cancel
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
}

export default function SimpleDialog({
  visible,
  title,
  message,
  icon = 'information-slab-box-outline',
  primaryLabel,
  secondaryLabel,
  onPrimaryAction,
  onSecondaryAction,
}: SimpleDialogProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onSecondaryAction}>
        <Dialog.Icon icon={icon} />
        <Dialog.Title style={{ textAlign: 'center' }}>{title}</Dialog.Title>
        <Dialog.Content>
          <Text>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onSecondaryAction}>{secondaryLabel}</Button>
          <Button mode="contained" contentStyle={{ paddingHorizontal: 12 }} onPress={onPrimaryAction}>
            {primaryLabel}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
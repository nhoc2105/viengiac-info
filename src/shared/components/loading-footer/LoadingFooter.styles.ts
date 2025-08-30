import { StyleSheet } from 'react-native';

export const loadingFooterStyles = StyleSheet.create({
  wrap: { paddingVertical: 20 },
  end: { textAlign: 'center', color: '#666', paddingVertical: 20 },
  btn: {
    alignSelf: 'center',
    backgroundColor: '#2e7d32',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 12,
  },
  btnText: { color: '#fff', fontWeight: '600' },
});
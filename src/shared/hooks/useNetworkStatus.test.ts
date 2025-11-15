import NetInfo from '@react-native-community/netinfo';
import { act, renderHook } from '@testing-library/react-native';
import useNetworkStatus from './useNetworkStatus';

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
}));

describe('useNetworkStatus', () => {
  let mockListener: (state: { isConnected: boolean }) => void;

  beforeEach(() => {
    mockListener = jest.fn();
    (NetInfo.addEventListener as jest.Mock).mockImplementation(cb => {
      mockListener = cb;
      return jest.fn(); // unsubscribe mock
    });
  });

  it('should return true by default', () => {
    // WHEN
    const { result } = renderHook(() => useNetworkStatus());
    
    // THEN
    expect(result.current).toBe(true);
  });

  it('should update when network status changes', () => {
    // WHEN
    const { result } = renderHook(() => useNetworkStatus());

    // AND simulate network status changes
    act(() => {
      mockListener({ isConnected: false });
    });

    // THEN
    expect(result.current).toBe(false);

    // WHEN simulate reconnection
    act(() => {
      mockListener({ isConnected: true });
    });

    // THEN
    expect(result.current).toBe(true);
  });
});
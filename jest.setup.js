import { jest } from '@jest/globals';
import 'whatwg-fetch'; // optional: polyfill fetch in jsdom environments

// If your components import from expo-router in unit tests,
// a simple mock avoids mounting a full router:
jest.mock('expo-router', () => ({ Stack: () => null }));

// Avoid opening real links during tests
import { Linking } from 'react-native';
jest.spyOn(Linking, 'openURL').mockImplementation(async () => true);


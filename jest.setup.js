import { jest } from '@jest/globals';
import 'whatwg-fetch'; // optional: polyfill fetch in jsdom environments

jest.mock("react-native/src/private/animated/NativeAnimatedHelper.js");

// If your components import from expo-router in unit tests,
// a simple mock avoids mounting a full router:
jest.mock('expo-router', () => ({ Stack: () => null }));

// Avoid opening real links during tests
import { Linking } from 'react-native';
jest.spyOn(Linking, 'openURL').mockImplementation(async () => true);

// Polyfill setImmediate for React Native
global.setImmediate = global.setImmediate || ((fn, ...args) => setTimeout(fn, 0));


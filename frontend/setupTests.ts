import React from 'react';

import '@jest/globals';
import '@testing-library/jest-dom';

import 'jest-canvas-mock';
import 'jest-styled-components';
import { TextEncoder } from 'util';

global.React = React;

const mockResponse = jest.fn();

global.URL.createObjectURL = jest.fn();
global.window.URL.createObjectURL = jest.fn();

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: mockResponse,
    removeListener: mockResponse,
    addEventListener: mockResponse,
    removeEventListener: mockResponse,
    dispatchEvent: mockResponse,
  })),
});

global.console = {
  ...console,
  log: mockResponse,
  debug: mockResponse,
  info: mockResponse,
  warn: mockResponse,
  error: mockResponse,
};

global.alert = mockResponse;
global.scrollTo = mockResponse;

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder as unknown as typeof global.TextEncoder;
}

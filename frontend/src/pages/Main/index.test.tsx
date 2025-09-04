import React from 'react';

import { type Navigator, Router } from 'react-router-dom';

import customRender from '@/utils/test/customRender';

import MainPage from './index';

// Mock MainRoutes
jest.mock('./MainRoutes', () => ({
  __esModule: true,
  MainRoutes: () => <div>Mocked MainRoutes</div>,
}));

describe('MainPage', () => {
  it('renders without crashing', () => {
    customRender(
      <Router location="/" navigator={{} as Navigator}>
        <MainPage />
      </Router>,
    );
  });
});

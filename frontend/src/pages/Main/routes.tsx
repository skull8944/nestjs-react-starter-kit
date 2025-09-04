import { type JSX, lazy } from 'react';

import PATH from '@/utils/path';

const ExamplePage = lazy(() => import('./pages/Example'));

export type RouteConfig = {
  path: string;
  element: JSX.Element;
};

export const routes: RouteConfig[] = [
  {
    path: PATH.example,
    element: <ExamplePage />,
  },
];

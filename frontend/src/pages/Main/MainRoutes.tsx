import React from 'react';

import { Route, Routes } from 'react-router-dom';

import { routes } from './routes';

export const MainRoutes: React.FC = () => {
  // put filter logic here for authorization control

  return (
    <Routes>
      {routes.map(({ path, element }) => (
        <Route key={`route-${path}`} path={path} element={element} />
      ))}
    </Routes>
  );
};

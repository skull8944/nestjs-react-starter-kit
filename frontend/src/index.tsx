import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { scan } from 'react-scan';

import { NODE_ENV } from '../env';

import App from './App';

const rootEl = document.getElementById('root');

scan({
  enabled: false, // Disable automatic scanning
});

if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);

  document.title = 'NestJS React Starter Kit';

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        gcTime: 0,
      },

      mutations: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  const isDev = NODE_ENV === 'development';

  root.render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>

      {isDev && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>,
  );
}

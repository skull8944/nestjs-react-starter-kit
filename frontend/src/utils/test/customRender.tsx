import type { JSX, ReactElement } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type RenderResult, render } from '@testing-library/react';

interface CustomRenderOptions {
  useRender?: boolean;
  useQueryClient?: boolean;
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {
    useRender: true,
    useQueryClient: true,
  },
): RenderResult | JSX.Element => {
  ui = options?.useQueryClient ? (
    <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>
  ) : (
    ui
  );

  return options.useRender ? render(ui) : ui;
};

export default customRender;

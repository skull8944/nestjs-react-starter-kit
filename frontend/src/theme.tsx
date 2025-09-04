import React from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';

const withTheme = (children: React.ReactNode) => (
  <ConfigProvider
    theme={{
      algorithm: antdTheme.defaultAlgorithm,
      token: {
        colorPrimary: '#1677ff',
        borderRadius: 6,
      },
    }}
  >
    {children}
  </ConfigProvider>
);

export default withTheme;

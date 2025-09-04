import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: 'default',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api/v1': 'http://localhost:8080',
      '/api/v2': 'http://localhost:8080',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            '@tanstack/react-query',
            'zustand',
            'antd',
            '@emotion/react',
            '@emotion/styled',
          ],
        },
      },
    },
  },
  define: {
    'process.env.AAD_CLIENT_ID': JSON.stringify(process.env.AAD_CLIENT_ID || ''),
    'process.env.AAD_TENANT_ID': JSON.stringify(process.env.AAD_TENANT_ID || ''),
    'process.env.FRONTEND_URL': JSON.stringify(process.env.FRONTEND_URL || ''),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || ''),
    'process.env.PUBLIC_VERSION_CODE': JSON.stringify(process.env.PUBLIC_VERSION_CODE || ''),
  },
});

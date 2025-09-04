import type { Config } from 'jest';

process.env.TZ = 'Asia/Taipei';
// Add any custom config to be passed to Jest
export default async (): Promise<Config> => ({
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'src/components/**/*.{ts,tsx}',
    '!src/components/common/**',
    'src/pages/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/pages/Example/**/*',
    '!src/pages/Dashboard/components/DashboardContent/components/ThreeCanvas/components/**/*',
    '!src/pages/Crystal/**/*',
  ],
  coverageReporters: ['json', ['lcov', { projectRoot: './' }], 'text', 'clover'],
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'mjs'],
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  transform: {
    // '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(antd)/)'],
  coveragePathIgnorePatterns: ['src/components/bootstrap.tsx'],
  moduleNameMapper: {
    '\\.(png)$': '<rootDir>/__mocks__/fileMock.ts',
    '\\.(svg)(\\?url|\\?react)?$': '<rootDir>/__mocks__/fileMock.ts',
    '^@/(.*?)(\\?url|\\?react)?$': '<rootDir>/src/$1',
    '^@fontsource/.*css$': 'identity-obj-proxy',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
});

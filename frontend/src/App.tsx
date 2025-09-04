import React from 'react';

import isPropValid from '@emotion/is-prop-valid';

import '@fontsource/noto-sans-tc/100.css';
import '@fontsource/noto-sans-tc/200.css';
import '@fontsource/noto-sans-tc/300.css';
import '@fontsource/noto-sans-tc/400.css';
import '@fontsource/noto-sans-tc/500.css';
import '@fontsource/noto-sans-tc/600.css';
import '@fontsource/noto-sans-tc/700.css';
import '@fontsource/noto-sans-tc/800.css';
import '@fontsource/noto-sans-tc/900.css';
import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/600.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';

import { App as AntdApp, message } from 'antd';
import { type ShouldForwardProp, StyleSheetManager } from 'styled-components';


import MainPage from '@/pages/Main';

import { NODE_ENV } from '../env';

import './App.css';
import withTheme from './theme';

// https://styled-components.com/docs/faqs#what-do-i-need-to-do-to-migrate-to-v6
// This implements the default behavior from styled-components v5
const shouldForwardProp: ShouldForwardProp<'web'> = (propName, target) => {
  if (typeof target === 'string') {
    // For HTML elements, forward the prop if it is a valid HTML attribute
    return isPropValid(propName);
  }
  // For other elements, forward all props
  return true;
};

console.log(`env`, NODE_ENV);

const App: React.FC = () => {
  const [_messageApi, contextHolder] = message.useMessage();

  return withTheme(
    <AntdApp>
      <div style={{ height: '100vh', width: '100vw' }}>
        {contextHolder}

        <StyleSheetManager shouldForwardProp={shouldForwardProp}>

          <MainPage />
        </StyleSheetManager>
      </div>
    </AntdApp>,
  );
};

export default App;

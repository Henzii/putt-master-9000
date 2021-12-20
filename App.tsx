import React from 'react';

import { Provider as PaperProvider } from 'react-native-paper'
import { NativeRouter } from 'react-router-native';
import Main from './src/components/Main'
import ToolBar from './src/components/ToolBar';
import { theme } from './src/utils/theme'

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NativeRouter>
        <Main />
      </NativeRouter>
    </PaperProvider>
  );
}

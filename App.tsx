import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper'
import { NativeRouter } from 'react-router-native';
import { Provider as ReduxProvider } from 'react-redux';

import Main from './src/components/Main';
import { theme } from './src/utils/theme';
import store from './src/utils/store';

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NativeRouter>
        <ReduxProvider store={store}>
          <Main />
        </ReduxProvider>
      </NativeRouter>
    </PaperProvider>
  );
}

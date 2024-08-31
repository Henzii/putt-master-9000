import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NativeRouter } from 'react-router-native';
import { Provider as ReduxProvider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';

import Main from './src/components/Main';
import { theme } from './src/utils/theme';
import store from './src/utils/store';
import { client } from './src/graphql/apolloClient';
import LocalSettingsProvider from './src/components/LocalSettingsProvider';
import BackButtonProvider from './src/components/BackButtonProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ErrorBoundary from 'react-native-error-boundary';
import BSOD from './src/components/BSOD';

export default function App() {

  return (
    <NativeRouter>
      <ErrorBoundary FallbackComponent={BSOD}>
      <ReduxProvider store={store}>
        <ApolloProvider client={client}>
          <BackButtonProvider>
            <PaperProvider theme={theme}>
              <LocalSettingsProvider>
                <SafeAreaProvider>
                  <Main />
                </SafeAreaProvider>
              </LocalSettingsProvider>
            </PaperProvider>
          </BackButtonProvider>
        </ApolloProvider>
      </ReduxProvider>
      </ErrorBoundary>
    </NativeRouter>

  );
}

AppRegistry.registerComponent('putt-master-9000', () => App);

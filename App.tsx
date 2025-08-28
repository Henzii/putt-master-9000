import React, { useEffect } from 'react';
import { AppRegistry } from 'react-native';
import { NativeRouter } from 'react-router-native';
import { Provider as ReduxProvider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';

import Main from './src/components/Main';
import store from './src/utils/store';
import { client } from './src/graphql/apolloClient';
import LocalSettingsProvider from './src/components/LocalSettingsProvider';
import BackButtonProvider from './src/components/BackButtonProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ErrorBoundary from 'react-native-error-boundary';
import BSOD from './src/components/BSOD';

import './src/localization/i18n';

import * as SplashScreen from 'expo-splash-screen';
import ThemeProvider from 'src/context/ThemeProvider';
SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    const timeout = setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <NativeRouter>
      <ErrorBoundary FallbackComponent={BSOD}>
      <ReduxProvider store={store}>
        <ApolloProvider client={client}>
          <BackButtonProvider>
            <ThemeProvider>
              <LocalSettingsProvider>
                <SafeAreaProvider>
                  <Main />
                </SafeAreaProvider>
              </LocalSettingsProvider>
            </ThemeProvider>
          </BackButtonProvider>
        </ApolloProvider>
      </ReduxProvider>
      </ErrorBoundary>
    </NativeRouter>

  );
}

AppRegistry.registerComponent('putt-master-9000', () => App);

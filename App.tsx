import React, { useEffect } from 'react';
import { AppRegistry } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NativeRouter } from 'react-router-native';
import { Provider as ReduxProvider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';

import Main from './src/components/Main';
import { theme } from './src/utils/theme';
import store from './src/utils/store';
import { client } from './src/graphql/apolloClient';

export default function App() {
  return (
    <ReduxProvider store={store}>
      <ApolloProvider client={client}>
        <NativeRouter>
          <PaperProvider theme={theme}>
            <Main />
          </PaperProvider>
        </NativeRouter>
      </ApolloProvider>
    </ReduxProvider>

  );
}

AppRegistry.registerComponent('putt-master-9000', () => App);

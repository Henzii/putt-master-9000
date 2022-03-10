import React, { useEffect, useState, useRef } from 'react';
import { AppRegistry } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NativeRouter } from 'react-router-native';
import { Provider as ReduxProvider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';

import Main from './src/components/Main';
import * as Notifications from 'expo-notifications';
import { theme } from './src/utils/theme';
import store from './src/utils/store';
import { client } from './src/graphql/apolloClient';
import registerForPushNotificationsAsync from './src/utils/registerForPushNotifications';

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token || ''));
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification as any);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('---', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  console.log(expoPushToken);
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

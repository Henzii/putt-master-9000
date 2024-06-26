import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { BackHandler } from 'react-native';
import ToolBar from './ToolBar';

import { Routes, Route, useNavigate } from 'react-router-native';

import Game from '../screens/Game';
import Frontpage from '../screens/Frontpage';
import SelectCourses from './SelectCourse/SelectCourse';
import FriendsList from './FriendsList';
import Notifications from './Notifications';
import Achievements from '../screens/Achievements';
import OldGames from '../screens/OldGames';
import SignUp from './SignUp';
import Settings from '../screens/Settings';
import Stats from '../screens/Stats';
import registerForPushNotificationsAsync from '../utils/registerForPushNotifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationResponse, addNotificationReceivedListener, addNotificationResponseReceivedListener, removeNotificationSubscription } from 'expo-notifications';
import { useDispatch } from 'react-redux';
import { addNotification } from '../reducers/notificationReducer';
import FirstTime from '../screens/Frontpage/FirstTime';
import { useBackButton } from './BackButtonProvider';
import DevPage from './DevPage';
import { useQuery } from '@apollo/client';
import { HANDSHAKE } from '../graphql/queries';
import appInfo from '../../app.json';
import { setCommonState } from '../reducers/commonReducer';

export default function App() {
    const dispatch = useDispatch();
    const backButton = useBackButton();
    const navi = useNavigate();
    const {data, loading} = useQuery(HANDSHAKE);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const notificListener = useRef<any>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const notificationResponseListener = useRef<any>();

    useEffect(() => {
        if (!loading && data?.handShake?.latestVersion) {
            if (data?.handShake?.latestVersion > appInfo.expo.android.versionCode) {
                dispatch(setCommonState({isUpdateAvailable: true}));
            }
        }
    }, [data, loading]);

    const handleNotificationClicked = (event: NotificationResponse) => {
        const gameId = event.notification.request.content.data?.gameId;
        if (gameId) {
            navi(`/game/${gameId}`);
        }
    };

    useEffect(() => {
        const handleBack = () => {
            backButton.goBack();
            return true;
        };
        // Haetaan push notifikaatioiden token ja tallennetaan se asyncstorageen
        registerForPushNotificationsAsync().then(token => {
            if (token) AsyncStorage.setItem('pushToken', token);
        }).catch(error => {
            dispatch(addNotification(error.message, 'warning'));
        });
        // Lisätään listeneri kuuntelemaan push notifikaatioita ja laitetaan ne omaan notifikaationininononon
        notificListener.current = addNotificationReceivedListener(notification => {
            dispatch(addNotification(notification.request.content.body || 'Received an empty notification???', 'info'));
        });

        notificationResponseListener.current = addNotificationResponseReceivedListener(handleNotificationClicked);

        // Listeneri kännykän back-napille
        BackHandler.addEventListener('hardwareBackPress', handleBack);
        return () => {
            // Poistetaan listenerit
            removeNotificationSubscription(notificListener.current);
            removeNotificationSubscription(notificationResponseListener.current);
            BackHandler.removeEventListener('hardwareBackPress', handleBack);
        };
    }, []);
    return (
        <>
            <Notifications />
            <ToolBar />
            <Routes>
                <Route path="/signUp/:param?" element={<SignUp />} />
                <Route path="/game/:gameId?" element={<Game />} />
                <Route path="/games" element={<OldGames />} />
                <Route path="/courses" element={<SelectCourses />} />
                <Route path="/friends" element={<FriendsList />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/firstTime" element={<FirstTime />} />
                <Route path="/development" element={<DevPage />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/" element={<Frontpage />} />
            </Routes>
            <StatusBar style="auto" />
        </>
    );
}

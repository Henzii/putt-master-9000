import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
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
import { addNotificationReceivedListener, useLastNotificationResponse } from 'expo-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../reducers/notificationReducer';
import FirstTime from '../screens/Frontpage/FirstTime';
import { useBackButton } from './BackButtonProvider';
import DevPage from './DevPage';
import { useLazyQuery } from '@apollo/client';
import { HANDSHAKE } from '../graphql/queries';
import appInfo from '../../app.json';
import { setCommonState } from '../reducers/commonReducer';
import { RootState } from '../utils/store';
import { useSession } from '../hooks/useSession';
import { HandShake } from '../types/queries';
import Feedback from '../screens/Feedback';
import Group from '../screens/Group';
import Distance from 'src/screens/Distance';

export default function App() {
    const dispatch = useDispatch();
    const backButton = useBackButton();
    const navi = useNavigate();
    const pushToken = useSelector((state: RootState) => state.common.pushToken);
    const [shakeHands] = useLazyQuery<HandShake>(HANDSHAKE);

    const user = useSession();

    const lastNotificationResponse = useLastNotificationResponse();

    useEffect(() => {
        const doHandShake = async () => {
            const handShakeResponse = await shakeHands({variables: {pushToken}});
            const latestVersion = handShakeResponse.data?.handShake?.latestVersion;
            if (latestVersion && latestVersion > appInfo.expo.android.versionCode) {
                dispatch(setCommonState({isUpdateAvailable: true}));
            }
        };
        if (user.isLoggedIn && pushToken !== undefined) {
            doHandShake();
        }
    }, [user, pushToken]);

    useEffect(() => {
        const gameId = lastNotificationResponse?.notification.request.content.data?.gameId;
        if (gameId) {
            navi(`/game/${gameId}`);
        }

    }, [lastNotificationResponse]);

    useEffect(() => {
        const handleBack = () => {
            backButton.goBack();
            return true;
        };

        registerForPushNotificationsAsync().then(token => {
            if (token) AsyncStorage.setItem('pushToken', token);
            dispatch(setCommonState({pushToken: token}));
        }).catch(error => {
            dispatch(addNotification(error.message, 'warning'));
            dispatch(setCommonState({pushToken: null}));
        });

        const notificListener = addNotificationReceivedListener(notification => {
            dispatch(addNotification(notification.request.content.body || 'Received an empty notification???', 'info'));
        });

        const backhandler = BackHandler.addEventListener('hardwareBackPress', handleBack);

        return () => {
            notificListener.remove();
            backhandler.remove();
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
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/group" element={<Group />} />
                <Route path="/distance" element={<Distance />} />
                <Route path="/" element={<Frontpage />} />
            </Routes>
            <StatusBar style="auto" />
        </>
    );
}

import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import ToolBar from './ToolBar';

import { Routes, Route, useNavigate } from 'react-router-native';

import Game from '../screens/Game';
import Frontpage from '../screens/Frontpage';
import SelectCourses from './SelectCourse';
import FriendsList from './FriendsList';
import Notifications from './Notifications';
import OldGamesList from './OldGamesList';
import SignUp from './SignUp';
import Settings from '../screens/Settings';
import Stats from '../screens/Stats';
import registerForPushNotificationsAsync from '../utils/registerForPushNotifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addNotificationReceivedListener, removeNotificationSubscription } from 'expo-notifications';
import { useDispatch } from 'react-redux';
import { addNotification } from '../reducers/notificationReducer';

export default function App() {
    const navi = useNavigate();
    const dispatch = useDispatch();
    const notificListener = useRef<any>();
    useEffect(() => {
        // Haetaan push notifikaatioiden token ja tallennetaan se asyncstorageen
        registerForPushNotificationsAsync().then(token => {
            if (token) AsyncStorage.setItem('pushToken', token);
        }).catch(error => {
            dispatch(addNotification(error.message, 'warning'));
        });
        // Lisätään listeneri kuuntelemaan push notifikaatioita ja laitetaan ne omaan notifikaationininononon
        notificListener.current = addNotificationReceivedListener(notification => {
            dispatch(addNotification(notification.request.content.body || 'Received and empty notification', 'info'));
        });
        return () => removeNotificationSubscription(notificListener.current);
    }, []);

    const goBack = () => {
        navi(-1);
    };
    return (
        <>
            <Notifications />
            <ToolBar handleMenuClick={goBack} />
            <Routes>
                <Route path="/signUp" element={<SignUp />} />
                <Route path="/game" element={<Game />} />
                <Route path="/games" element={<OldGamesList />} />
                <Route path="/courses" element={<SelectCourses />} />
                <Route path="/friends" element={<FriendsList />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/" element={<Frontpage />} />
            </Routes>
            <StatusBar style="auto" />
        </>
    );
}

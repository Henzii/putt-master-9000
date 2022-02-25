import React from 'react';
import { StyleSheet } from 'react-native';
import { Portal, Snackbar, Subheading } from "react-native-paper";
import { useDispatch, useSelector } from 'react-redux';
import { removeNotification } from '../reducers/notificationReducer';
import { RootState } from '../utils/store';

const Notifications = () => {
    const notifications = useSelector((state: RootState) => state.notifications);
    const dispatch = useDispatch();
    const notitype = notifications[0]?.type || 'info';
    return (
        <Portal>
            <Snackbar
                style={[tyyli.main, tyyli[notitype]]}
                visible={notifications.length > 0}
                onDismiss={() => dispatch(removeNotification())}
                duration={(notifications.length > 1) ? 2000 : 5000}
            >
                <Subheading style={{ color: 'white' }}>
                    {notifications[0]?.message || ''}
                </Subheading>
            </Snackbar>
        </Portal>
    );
};

const tyyli = StyleSheet.create({
    main: {
        opacity: 0.8,
    },
    info: {
        backgroundColor: 'blue',
    },
    alert: {
        backgroundColor: 'red',
    },
    success: {
        backgroundColor: 'green',
    },
    warning: {
        backgroundColor: 'orange',
    }
});

export default Notifications;
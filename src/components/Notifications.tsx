import React, { useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Portal, Snackbar, Subheading } from "react-native-paper";
import { useDispatch, useSelector } from 'react-redux';
import { removeNotification, Notification } from '../reducers/notificationReducer';
import { RootState } from '../utils/store';

const Notifications = () => {
    const notifications = useSelector((state: RootState) => state.notifications);
    // Viimeisin tyyppi/väri muistiin jotta väri pysyy samana kun on tyhjä notifikaatio
    const lastType = useRef<Notification['type']>('info');
    const dispatch = useDispatch();
    useEffect(() => {
        if (notifications[0]?.type && notifications[0].type !== lastType.current) {
            lastType.current = notifications[0].type;
        }
    }, [notifications]);
    const notitype = notifications[0]?.type || lastType.current || 'info';
    return (
        <Portal>
            <Snackbar
                style={[tyyli.main, tyyli[notitype]]}
                visible={notifications.length > 0}
                onDismiss={() => dispatch(removeNotification())}
                duration={(notifications.length > 1) ? 2000 : 5000}
                action={{ label: 'dismiss' }}
            >
                <Subheading style={tyyli.text}>
                    {notifications[0]?.message || ''}
                </Subheading>
            </Snackbar>
        </Portal>
    );
};

const tyyli = StyleSheet.create({
    text: {
        fontSize: 17,
        color: 'white',
        fontWeight: 'bold',
    },
    main: {
        opacity: 0.9,
        borderWidth: 1,
        borderRadius: 10,
    },
    info: {
        backgroundColor: 'rgb(100,170,255)',
    },
    alert: {
        backgroundColor: 'rgb(255,70,70)',
    },
    success: {
        backgroundColor: 'rgb(120,200,120)',
    },
    warning: {
        backgroundColor: 'orange',
    }
});

export default Notifications;
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const registerForPushNotificationsAsync = async (): Promise<string | undefined> => {
    let token: string | undefined;
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            throw Error('Failed to get push token for push notification!');
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
        throw Error('Must use physical device for push notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            sound: 'gameon.wav'
        });
    }
    return token;
};

export default registerForPushNotificationsAsync;
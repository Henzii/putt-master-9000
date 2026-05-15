import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { ComponentProps } from 'react';
import { Linking } from "react-native";
import { Button } from "react-native-paper";

import store from '../utils/store';
import { addNotification } from 'src/reducers/notificationReducer';

const BASE_URL = "https://fudisc.henzi.fi";

type Props = {
    children?: string
    path?: string
    url?: string
    withToken?: boolean
} & Omit<ComponentProps<typeof Button>, 'children' | 'onPress'>;

export const openWebsite = async ({path, withToken, url = BASE_URL}: Omit<Props, "children">) => {
    try {
        const pathPart = path ? `/${path}` : "";
        const tokenPart = withToken ? `?token=${await AsyncStorage.getItem('token')}` : "";
        const link = `${url}${pathPart}${tokenPart}`;

        await Linking.openURL(link);

    } catch (error) {
       store.dispatch(addNotification('Failed to open the link', 'alert'));
    }
};

const WebLinkButton = ({children, path, withToken, url = BASE_URL, ...rest}: Props) => {
    const handlePress = () => {
        openWebsite({path, withToken, url});
    };

    return (
        <Button onPress={handlePress} icon="open-in-new" contentStyle={{ flexDirection: 'row-reverse' }} {...rest}>
            {children ?? url}
        </Button>
    );
};

export default WebLinkButton;
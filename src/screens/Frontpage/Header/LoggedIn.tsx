import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from 'react-i18next';
import SplitContainer from '../../../components/ThemedComponents/SplitContainer';
import { useSessionV2 } from '@hooks/session/useSessionV2';

const LoggedIn = () => {
    const { t } = useTranslation();
    const { user } = useSessionV2();

    return (
            <SplitContainer>
                <View>
                    <Text style={styles.text}>{t('screens.frontpage.welcome')}</Text>
                    <Text style={styles.name}>{user.name}</Text>
                </View>
            </SplitContainer>
    );
};

const styles = StyleSheet.create({
    text: {
        color: 'white'
    },
    name: {
        color: 'white',
        fontSize: 22,
        fontWeight: '600'
    },
    button: {
    }
});

export default LoggedIn;
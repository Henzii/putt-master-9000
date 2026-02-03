import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from 'react-i18next';
import useMe from '../../../hooks/useMe';
import SplitContainer from '../../../components/ThemedComponents/SplitContainer';

const LoggedIn = () => {
    const { t } = useTranslation();
    const me = useMe();

    return (
            <SplitContainer>
                <View>
                    <Text style={styles.text}>{t('screens.frontpage.welcome')}</Text>
                    <Text style={styles.name}>{me?.me?.name}</Text>
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
import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import Spacer from '../../../components/ThemedComponents/Spacer';

const UpdateAvailable = () => {
    const { t } = useTranslation();
    const handleButtonClick = () => {
        Linking.openURL('market://details?id=com.henzisoft.puttmaster9000');
    };
    return (
        <>
                <Text style={styles.header}>{t('screens.frontpage.updateAvailable')}</Text>
                <Text style={styles.text}>{t('screens.frontpage.updateMessage')}</Text>
                <Spacer />
                <View style={{flexDirection: 'row'}}>
                    <Button style={styles.button} onPress={handleButtonClick}>{t('screens.frontpage.updateNow')}</Button>
                </View>
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        color: 'white',
        fontSize: 20
    },
    text: {
        color: 'white',
    },
    button: {
        backgroundColor: 'white',
    }
});

export default UpdateAvailable;
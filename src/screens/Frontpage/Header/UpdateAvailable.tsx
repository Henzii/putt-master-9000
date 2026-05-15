import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Spacer from '../../../components/ThemedComponents/Spacer';
import WebLinkButton from '@components/WebLinkButton';

const UpdateAvailable = () => {
    const { t } = useTranslation();
    return (
        <>
                <Text style={styles.header}>{t('screens.frontpage.updateAvailable')}</Text>
                <Text style={styles.text}>{t('screens.frontpage.updateMessage')}</Text>
                <Spacer />
                <View style={{flexDirection: 'row'}}>
                    <WebLinkButton style={styles.button} url="market://details?id=com.henzisoft.puttmaster9000">
                        {t('screens.frontpage.updateNow')}
                    </WebLinkButton>
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
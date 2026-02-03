import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { ActivityIndicator, Caption } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

type LoadingProps = {
    loadingText?: string,
    noFullScreen?: boolean,
    showTexts?: boolean,
    showErrorAfter?: number,
    changeTextAfter?: number,
    customTexts?: string[]
}
const Loading = ({loadingText, noFullScreen=false, showTexts, changeTextAfter = 10000, customTexts}: LoadingProps) => {
    const { t } = useTranslation();
    const textIndex = useRef(-1);
    const [customText, setCustomText] = useState('');

    const defaultTexts = [
        t('components.loading.serverSleeping'),
        t('components.loading.wakeUp'),
        t('components.loading.somethingWrong'),
        t('components.loading.tryTurningOff')
    ];

    const textsToUse = customTexts ?? defaultTexts;
    const displayLoadingText = loadingText ?? t('components.loading.defaultText');
    useEffect(() => {
        let textInterval: ReturnType<typeof setInterval>;
        if (showTexts) {
            textInterval = setInterval(() => {
                if (textIndex.current < textsToUse.length-1) {
                    textIndex.current++;
                    setCustomText(textsToUse[textIndex.current]);
                }
            }, changeTextAfter);
        }
        return () => clearInterval(textInterval);
    }, [textsToUse]);

    const tyylit = [
        tyyli.container,
        tyyli.teksti,
        (!noFullScreen && tyyli.fullScreen)
    ];

    return (
        <View style={tyylit}>
            <ActivityIndicator animating size={'large'} testID="progress" />
            <Caption style={tyyli.teksti}>{showTexts && textIndex.current >= 0 ? customText : displayLoadingText}</Caption>
        </View>
    );
};
const tyyli = StyleSheet.create({
    container: {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
    },
    teksti: {
        fontSize: 20,
        marginTop: 20,
    },
    fullScreen: {
        height: Dimensions.get('window').height*0.8,
        justifyContent: 'center',
    }
});
export default Loading;
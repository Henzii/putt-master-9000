import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { ActivityIndicator, Caption } from 'react-native-paper';

const texts = [
    'Server seems to be sleeping...',
    'Wake up you stupid piece of shit!',
    'Hmm.. something might be wrong 🤔',
    'Have you tried turning it off and on again?'
];

type LoadingProps = {
    loadingText?: string,
    noFullScreen?: boolean,
    showTexts?: boolean,
    showErrorAfter?: number,
    changeTextAfter?: number,
    customTexts?: string[]
}
const Loading = ({loadingText = 'Loading...', noFullScreen=false, showTexts, changeTextAfter = 10000, customTexts = texts}: LoadingProps) => {
    const textIndex = useRef(-1);
    const [customText, setCustomText] = useState('');
    useEffect(() => {
        let textInterval: NodeJS.Timer;
        if (showTexts) {
            textInterval = setInterval(() => {
                if (textIndex.current < texts.length-1) {
                    textIndex.current++;
                    setCustomText(customTexts[textIndex.current]);
                }
            }, changeTextAfter);
        }
        return () => clearInterval(textInterval);
    }, []);

    const tyylit = [
        tyyli.container,
        tyyli.teksti,
        (!noFullScreen && tyyli.fullScreen)
    ];

    return (
        <View style={tyylit}>
            <ActivityIndicator animating size={'large'} testID="progress" />
            <Caption style={tyyli.teksti}>{showTexts && textIndex.current >= 0 ? customText : loadingText}</Caption>
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
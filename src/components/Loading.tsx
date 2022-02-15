import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { ActivityIndicator, Caption } from 'react-native-paper';
type LoadingProps = {
    loadingText?: string,
    noFullScreen?: boolean
}
const Loading = ({loadingText = 'Loading...', noFullScreen=false}: LoadingProps) => {
    const tyylit = [
        tyyli.container,
        tyyli.teksti,
        (!noFullScreen && tyyli.fullScreen)
    ];
    return (
        <View style={tyylit}>
            <ActivityIndicator animating size={'large'} testID="progress" />
            <Caption style={tyyli.teksti}>{loadingText}</Caption>
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
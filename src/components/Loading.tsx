import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { ActivityIndicator, Caption } from 'react-native-paper';

const Loading = ({loadingText = 'Loading...'}: { loadingText?: string}) => {
    return (
        <View style={tyyli.container}>
            <ActivityIndicator animating size={'large'} testID="progress" />
            <Caption style={tyyli.teksti}>{loadingText}</Caption>
        </View>
    )
}
const tyyli = StyleSheet.create({
    container: {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height: Dimensions.get('window').height*0.8,
    },
    teksti: {
        fontSize: 20,
        marginTop: 20,
    }
})
export default Loading;
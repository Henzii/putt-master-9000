import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
type ContainerProps = {
    children: any,
    fullScreen?: boolean,
    noFlex?: boolean,
    style?: Object,
    noPadding?: boolean    
}

const Container = (props: ContainerProps) => {
    const { colors } = useTheme();
    const tyyli = [
        props.fullScreen && tyylit.fullScreen,
        { backgroundColor: '#fafafa' },
        !props.noFlex && { flex: 1 },
        props.style,
        {
            padding: (props.noPadding) ? 0: 20,
        }
    ]
    return (
        <View style={tyyli}>
            {props.children}
        </View>
    )
}

const tyylit = StyleSheet.create({
    fullScreen: {
        width: '100%',
        minHeight: Dimensions.get('screen').height,
    },
})

export default Container;
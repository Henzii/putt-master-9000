import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
//import { useTheme } from 'react-native-paper';
type ContainerProps = {
    children: React.ReactElement | React.ReactElement[] ,
    fullScreen?: boolean,
    noFlex?: boolean,
    style?: { [key: string]: string | number},
    fullWidth?: boolean
    noPadding?: boolean
}

const Container = (props: ContainerProps) => {
//    const { colors } = useTheme();
    const tyyli = [
        props.fullScreen && tyylit.fullScreen,
        props.fullWidth && tyylit.fullWidth,
        !props.noFlex && { flex: 1 },
        {
            padding: (props.noPadding) ? 0: 20,
            backgroundColor: '#fafafa'
        },
        props.style,
    ];
    return (
        <View style={tyyli}>
            {props.children}
        </View>
    );
};

const tyylit = StyleSheet.create({
    fullWidth: {
        width: '100%',
    },
    fullScreen: {
        width: '100%',
        minHeight: Dimensions.get('screen').height,
    },
});

export default Container;
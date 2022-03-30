import React from 'react';
import { Dimensions, StyleSheet, View, ScrollView } from 'react-native';
//import { useTheme } from 'react-native-paper';
type ContainerProps = {
    children: React.ReactElement | null | (React.ReactElement | null)[],
    fullScreen?: boolean,
    noFlex?: boolean,
    style?: { [key: string]: string | number},
    fullWidth?: boolean
    noPadding?: boolean
    withScrollView?: boolean,
    fullHeight?: boolean,
}

const Container = (props: ContainerProps) => {
//    const { colors } = useTheme();
    const tyyli = [
        props.fullScreen && tyylit.fullScreen,
        props.fullWidth && tyylit.fullWidth,
        props.fullHeight && tyylit.fullHeight,
        !props.noFlex && { flex: 1 },
        {
            padding: (props.noPadding) ? 0: 20,
            backgroundColor: '#fafafa'
        },
        props.style,
    ];
    if (props.withScrollView) {
        return (
            <ScrollView contentContainerStyle={tyyli}>
                {props.children}
            </ScrollView>
        );
    }
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
    fullHeight: {
        minHeight: '100%'
    },
    fullScreen: {
        width: '100%',
        minHeight: Dimensions.get('screen').height,
    },
});

export default Container;
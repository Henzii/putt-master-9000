import React, { PropsWithChildren } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Dimensions, StyleSheet, View, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';

type Props = {
    fullScreen?: boolean,
    noFlex?: boolean,
    style?: StyleProp<ViewStyle>
    fullWidth?: boolean
    noPadding?: boolean,
    verticalPadding?: boolean,
    withScrollView?: boolean,
    fullHeight?: boolean,
}

const Container = (props: PropsWithChildren<Props>) => {
    const { colors } = useTheme();
    const tyyli = [
        props.fullScreen && tyylit.fullScreen,
        props.fullWidth && tyylit.fullWidth,
        props.fullHeight && tyylit.fullHeight,
        (!props.noFlex && !props.withScrollView) && { flex: 1 },
        {
            padding: (props.noPadding && !props.verticalPadding) ? 0: 20,
            backgroundColor: colors.background,
        },
        props.verticalPadding && tyylit.verticalPadding,
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
    verticalPadding: {
        paddingVertical: 7,
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
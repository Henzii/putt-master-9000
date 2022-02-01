
import React from 'react';
import { GestureResponderEvent, StyleSheet } from 'react-native';
import { Appbar, Menu as PaperMenu } from 'react-native-paper'

export default function ToolBar({ handleMenuClick }:{ handleMenuClick: () => void} ) {
    return (
        <Appbar style={tyyli.top}>
            <Appbar.Action icon="arrow-left" onPress={handleMenuClick} />
            <Appbar.Content title="FuDisc 9000" />
        </Appbar>
    )
};

const tyyli = StyleSheet.create({
    top: {
        position: 'relative',
        width: '100%',
        height: 70,
        left: 0,
        right: 0,
        top: 0,
        zIndex: 100

    },
    title: {
        color: 'red',
    }
})
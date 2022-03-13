
import React from 'react';
import { StyleSheet, } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useLocation, useNavigate } from 'react-router-native';
export default function ToolBar() {
    const navi = useNavigate();
    const loca = useLocation();
    const onMainScreen = loca.pathname === '/';
    return (
        <Appbar style={tyyli.top}>
            <Appbar.Action
                icon={!onMainScreen ? 'arrow-left' : ''}
                onPress={!onMainScreen ? () => navi(-1) : undefined}/>
            <Appbar.Content title="FuDisc" />
        </Appbar>
    );
}

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
});
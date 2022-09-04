
import React, { useState, useRef } from 'react';
import { StyleSheet, } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useLocation, useNavigate } from 'react-router-native';
import { useBackButton } from './BackButtonProvider';
export default function ToolBar() {
    const [counter, setCounter] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const loca = useLocation();
    const navi = useNavigate();
    const backButton = useBackButton();
    const onMainScreen = loca.pathname === '/';
    const handleTitlePress = () => {
        setCounter(v => v+1);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        if (counter > 10) {
            setCounter(0);
            navi('/development');
        } else {
            timerRef.current = setTimeout(() => {
                setCounter(0);
            }, 200);
        }
    };
    const toolBarColor = process.env.NODE_ENV === 'preview'
        ? {backgroundColor: '#ff5555'}
        : process.env.NODE_ENV === 'development'
            ? {backgroundColor: '#5555ff'}
            : false;
    return (
        <Appbar style={[tyyli.top, toolBarColor]}>
            <Appbar.Action
                icon={!onMainScreen ? 'arrow-left' : ''}
                onPress={!onMainScreen ? backButton.goBack : undefined}/>
            <Appbar.Content title="FuDisc" onTouchStart={handleTitlePress} />
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
        zIndex: 100,
    },
});

import React, { useState, useRef } from 'react';
import { StyleSheet, } from 'react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { Appbar } from 'react-native-paper';
import { useLocation, useNavigate } from 'react-router-native';
import { useBackButton } from './BackButtonProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ToolBar() {
    const [counter, setCounter] = useState(0);
    const [color, setColor] = useState<string | false>(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const loca = useLocation();
    const navi = useNavigate();
    const backButton = useBackButton();
    const storage = useAsyncStorage('apiEnv');
    storage.getItem().then(col => setColor(col as string)).catch(() => setColor(process.env.NODE_ENV as string));
    const onMainScreen = loca.pathname === '/';

    const insets = useSafeAreaInsets();

    const handleTitlePress = () => {
        setCounter(v => (v+1));
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        if (counter > 10) {
            setCounter(0);
            navi('/development');
        } else {
            timerRef.current = setTimeout(() => {
                setCounter(0);
            }, 1000);
        }
    };
    const toolBarColor = {
        backgroundColor: color === 'preview' ? '#ff3333' : '#3333ff'
    };
    const styles = createStyles(insets.top ?? 0);
    return (
        <Appbar style={[
            styles.top,
            (color !== 'production' && !!color) && toolBarColor,
        ]}>
            <Appbar.Action
                icon={!onMainScreen ? 'arrow-left' : ''}
                onPress={!onMainScreen ? backButton.goBack : undefined}/>
            <Appbar.Content title="FuDisc" onTouchStart={handleTitlePress} />
        </Appbar>
    );
}

const createStyles = (topSafeArea: number) => StyleSheet.create({
    top: {
        position: 'relative',
        width: '100%',
        height: (70 + topSafeArea),
        paddingTop: topSafeArea,
        elevation: 0,
        left: 0,
        right: 0,
        top: 0,
        zIndex: 100,
    },
});
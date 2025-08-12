
import React, { useState, useRef } from 'react';
import { StyleSheet, } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useLocation, useNavigate } from 'react-router-native';
import { useBackButton } from './BackButtonProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ToolBar() {
    const [counter, setCounter] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const location = useLocation();
    const navi = useNavigate();
    const backButton = useBackButton();
    const onMainScreen = location.pathname === '/';
    const insets = useSafeAreaInsets();
    const {colors} = useTheme();

    const handleTitlePress = () => {
        setCounter(v => (v + 1));
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
    const styles = createStyles(insets.top ?? 0);
    return (
        <Appbar style={[styles.top, {backgroundColor: colors.primary}]}>
            <Appbar.Action
                icon={!onMainScreen ? 'arrow-left' : ''}
                iconColor='white'
                onPress={!onMainScreen ? backButton.goBack : undefined} />
            <Appbar.Content title="FuDisc" onTouchStart={handleTitlePress} titleStyle={styles.title} />
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
    title: {
        color: 'white',
    }
});
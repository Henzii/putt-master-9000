import React, { useEffect, useRef } from 'react';
import { PropsWithChildren } from "react";
import { Animated, Dimensions, Pressable, StyleSheet } from 'react-native';
import { Portal } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('screen').width;

type Props = PropsWithChildren & {
    open: boolean
    onClose: () => void
}
const Sheet = ({children, open, onClose}: Props) => {
    const insets = useSafeAreaInsets();
    const slideAnim = useRef(new Animated.Value(-screenWidth)).current;

    useEffect(() => {
        if (open) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: -screenWidth,
                duration: 250,
                useNativeDriver: false,
            }).start();
        }
    }, [open]);
    return (
        <Portal>
            {open && <Pressable style={styles.backDrop} onPress={onClose} />}
            <Animated.View style={[styles.container, {paddingTop: insets.top, left: slideAnim}]}>
                {children}
            </Animated.View>
        </Portal>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: screenWidth - 50,
        backgroundColor: '#fefefe',
        zIndex: 10,
        padding: 10,
    },
    backDrop: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
        opacity: 0.6,
        zIndex: 1
    }
});

export default Sheet;
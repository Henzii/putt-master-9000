import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import * as ExpoUpdates from 'expo-updates';

const BSOD = () => {
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        if (counter >= 10) {
            ExpoUpdates.reloadAsync();
        }
    }, [counter]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter(val => val + 1);
        }, 1500);

        return () => clearInterval(interval);
    }, []);
    return (
        <View style={styles.container}>
            <Text style={styles.smiley}>:(</Text>
            <Text style={styles.text}>Your FuDisc ran into a problem and needs to restart. We&apos;re faking
                some error info collection, and then we&apos;ll restart for you.
            </Text>
            <Text style={styles.text}>{counter}0% complete</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0078d7',
        height: '100%',
        padding: 20
    },
    smiley: {
        color: 'white',
        fontSize: 80
    },
    text: {
        marginTop: 15,
        color: 'white',
        fontSize: 18,
        fontWeight: '200',
    }
});

export default BSOD;
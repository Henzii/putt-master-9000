import React from 'react';
import WithBackground from './WithBackground';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Button } from 'react-native-paper';
import Spacer from '../../../components/ThemedComponents/Spacer';

const UpdateAvailable = () => {
    const handleButtonClick = () => {
        Linking.openURL('market://details?id=com.henzisoft.puttmaster9000');
    };
    return (
        <WithBackground>
                <Text style={styles.header}>Update!</Text>
                <Text style={styles.text}>New version of FuDisc available on Play store!</Text>
                <Spacer />
                <View style={{flexDirection: 'row'}}>
                    <Button style={styles.button} onPress={handleButtonClick}>Update now</Button>
                </View>
        </WithBackground>
    );
};

const styles = StyleSheet.create({
    header: {
        color: 'white',
        fontSize: 20
    },
    text: {
        color: 'white',
    },
    button: {
        backgroundColor: 'white',
    }
});

export default UpdateAvailable;
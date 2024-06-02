import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Button } from 'react-native-paper';
import Spacer from '../../../components/ThemedComponents/Spacer';
import RoundedHeader from '../../../components/RoundedHeader';

const UpdateAvailable = () => {
    const handleButtonClick = () => {
        Linking.openURL('market://details?id=com.henzisoft.puttmaster9000');
    };
    return (
        <RoundedHeader>
                <Text style={styles.header}>Update!</Text>
                <Text style={styles.text}>New version of FuDisc available on Play store!</Text>
                <Spacer />
                <View style={{flexDirection: 'row'}}>
                    <Button style={styles.button} onPress={handleButtonClick}>Update now</Button>
                </View>
        </RoundedHeader>
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
import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import useMe from '../../../hooks/useMe';
import SplitContainer from '../../../components/ThemedComponents/SplitContainer';

const LoggedIn = () => {
    const me = useMe();

    return (
            <SplitContainer>
                <View>
                    <Text style={styles.text}>Welcome</Text>
                    <Text style={styles.name}>{me?.me?.name}</Text>
                </View>
            </SplitContainer>
    );
};

const styles = StyleSheet.create({
    text: {
        color: 'white'
    },
    name: {
        color: 'white',
        fontSize: 22,
        fontWeight: '600'
    },
    button: {
    }
});

export default LoggedIn;
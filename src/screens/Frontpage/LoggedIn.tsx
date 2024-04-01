import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from 'react-native-paper';
import RoundBottom from './RoundBottom';
import useMe from '../../hooks/useMe';
import SplitContainer from '../../components/ThemedComponents/SplitContainer';


const LoggedIn = () => {
    const {colors} = useTheme();
    const me = useMe();

    return (
        <>
            <View style={[styles.container, {backgroundColor: colors.primary}]}>
                <SplitContainer>
                    <View>
                        <Text style={styles.text}>Welcome</Text>
                        <Text style={styles.name}>{me?.me?.name}</Text>
                    </View>
                </SplitContainer>
            </View>
            <RoundBottom fill={colors.primary} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
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
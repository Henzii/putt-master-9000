import React from 'react';
import { StyleSheet, View, Text } from "react-native";

type Props = {
    number: string,
    title: string
}

const NumberedTitle = ({number, title}: Props) => (
    <View style={styles.container}>
        <Text style={[styles.text, styles.number]}>{number}</Text>
        <Text style={styles.text}>{title}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: '600',
    },
    number: {
        borderWidth: 1,
        borderRadius: 50,
        width: 30,
        height: 30,
        marginTop: 2,
        textAlign: 'center',
        textAlignVertical: 'center',
        marginRight: 8,
    }
});

export default NumberedTitle;

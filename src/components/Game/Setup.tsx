import React, { useState } from 'react';
import { StyleSheet, Text, View } from "react-native";
import { Button, Caption, Divider, Paragraph, TextInput, Title } from 'react-native-paper';

const Setup = () => {

    const [beers, setBeers] = useState<number | null>(null);
    const handleBeersChange = (value: string) => {
        if (value === '') setBeers(null);

        const intValue = Number.parseInt(value);
        if (isNaN(intValue)) return;
        setBeers(intValue);
    }
    return (
        <View style={tyyli.main} >
            <View style={tyyli.container}>
                <Title>Beers</Title>
                <Paragraph>
                    Beers drank during the round
                </Paragraph>
                <TextInput 
                    autoComplete={false}
                    keyboardType='numeric'
                    value={(beers) ? beers.toString() : ''}
                    onChangeText={handleBeersChange}
                    style={tyyli.numberInput}
                    label='# beers'
                />
            </View>
            <Divider style={tyyli.divider} />
            <View style={tyyli.container}>
                <Button mode='contained' style={tyyli.nappi}>End game</Button>
            </View>
        </View>
    )
}
const tyyli = StyleSheet.create({
    main: {
        width: '100%',
    },
    container: {
        padding: 20,
        display: 'flex',
    },
    divider: {
        marginTop: 10,
        height: 2,
    },
    numberInput: {
        width: 100,
    },
    nappi: {
        paddingVertical: 10,
        borderRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'lightgray'
    }
})
export default Setup;
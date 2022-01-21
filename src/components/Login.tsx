import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import { Button, Headline, TextInput } from "react-native-paper";
import useMe from '../hooks/useMe';

const Login = () => {
    const { me, login, logged } = useMe();
    const handleLogin = () => {
        login('jotain', 'jotain')
    }
    console.log(me)
    return (
        <View style={tyyli.main}>
            <Headline>Must now one login</Headline>
            <TextInput label="Username" mode='outlined' autoComplete={false} />
            <TextInput secureTextEntry label="Password" mode='outlined' autoComplete={false} />
            <Button onPress={handleLogin} style={tyyli.nappi} mode='contained' color='skyblue'>Login</Button>
        </View>
    )
}

const tyyli = StyleSheet.create({
    main: {
        width: '100%',
        padding: 10,
        display: 'flex',
    },
    nappi: {
        marginTop: 10,
    }
})

export default Login;
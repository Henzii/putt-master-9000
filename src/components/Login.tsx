import React, { useState } from 'react';
import { StyleSheet, Text, View } from "react-native";
import { Button, Headline, TextInput } from "react-native-paper";
import useMe from '../hooks/useMe';

const Login = () => {
    const { me, login, logged } = useMe();
    const [ username, setUsername] = useState('')
    const [ password, setPassword] = useState('')
    const handleLogin = async () => {
        await login(username, password)
        setUsername('')
        setPassword('')
    }
    return (
        <View style={tyyli.main}>
            <Headline>Must now one login</Headline>
            <TextInput label="Username" mode='outlined' autoComplete={false} value={username} onChangeText={(v) => setUsername(v)}/>
            <TextInput secureTextEntry label="Password" mode='outlined' autoComplete={false} value={password} onChangeText={(v) => setPassword(v)}/>
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
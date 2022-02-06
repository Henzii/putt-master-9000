import React, { useState } from 'react';
import { StyleSheet, View } from "react-native";
import { Button, Title, TextInput } from "react-native-paper";
import { Navigate } from 'react-router-native';
import useMe from '../hooks/useMe';

const Login = ({ login }: {login: (s1: string, s2: string) => void }) => {
    const [ username, setUsername] = useState('')
    const [ password, setPassword] = useState('')
    const handleLogin = () => {
        login(username, password)
        setUsername('')
        setPassword('')
        
    }
    return (
        <View style={tyyli.main}>
            <Title>Please insert credit card</Title>
            <TextInput label="Username" mode='outlined' autoComplete={false} value={username} onChangeText={(v) => setUsername(v)}/>
            <TextInput secureTextEntry label="Password" mode='outlined' autoComplete={false} value={password} onChangeText={(v) => setPassword(v)}/>
            <Button onPress={handleLogin} style={tyyli.nappi} mode='contained'>Login</Button>
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
        padding: 5,
    }
})

export default Login;
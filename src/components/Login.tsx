import React, { useState } from 'react';
import { StyleSheet } from "react-native";
import { Button, Title, TextInput } from "react-native-paper";
import { useDispatch } from 'react-redux';
import { addNotification } from '../reducers/notificationReducer';
import Container from './ThemedComponents/Container';

const Login = ({ login }: {login: (s1: string, s2: string) => Promise<void> }) => {
    const [ username, setUsername] = useState('');
    const [ password, setPassword] = useState('');
    const dispatch = useDispatch();
    const handleLogin = async () => {
        login(username, password).catch(() => {
            dispatch(addNotification('Wrong username or password', 'alert'));
            setPassword('');
        });

    };
    return (
        <Container fullWidth>
            <Title>Login</Title>
            <TextInput testID='user' label="Username" mode='outlined' autoComplete={false} value={username} onChangeText={(v) => setUsername(v)}/>
            <TextInput testID='password' secureTextEntry label="Password" mode='outlined' autoComplete={false} value={password} onChangeText={(v) => setPassword(v)}/>
            <Button onPress={handleLogin} style={tyyli.nappi} mode='contained' testID='LoginButton'>Login</Button>
        </Container>
    );
};

const tyyli = StyleSheet.create({
    nappi: {
        marginTop: 10,
        padding: 5,
    }
});

export default Login;
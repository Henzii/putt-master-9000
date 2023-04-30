import React from 'react';
import { StyleSheet, TextInput } from "react-native";
import { Button, Title, TextInput as Input } from "react-native-paper";
import { useDispatch } from 'react-redux';
import { addNotification } from '../reducers/notificationReducer';
import Container from './ThemedComponents/Container';
import useTextInput from '../hooks/useTextInput';

const Login = ({ login }: {login: (s1: string, s2: string) => Promise<void> }) => {
    const username = useTextInput({});
    const password = useTextInput({});
    const dispatch = useDispatch();
    const handleLogin = async () => {
        login(username.value, password.value).catch(() => {
            dispatch(addNotification('Wrong username or password', 'alert'));
            password.onChangeText('');
        });

    };
    const setFocus = (next?: React.RefObject<TextInput>) => {
        if (!next) return;
        next?.current?.focus();
    };

    return (
        <Container fullWidth>
            <Title>Login</Title>
            <Input {...username} testID="user" style={tyyli.nappi} mode='flat' label="Username" onSubmitEditing={() => setFocus(password.ref)} />
            <Input {...password} testID="password" style={tyyli.nappi} secureTextEntry label="Password" onSubmitEditing={handleLogin} />
            <Button testID="LoginButton" onPress={handleLogin} mode="contained" style={tyyli.nappi}>Login</Button>
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
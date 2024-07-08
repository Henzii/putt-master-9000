import React from 'react';
import { StyleSheet, TextInput } from "react-native";
import { Button, Title, TextInput as Input } from "react-native-paper";
import { useDispatch } from 'react-redux';
import { addNotification } from '../reducers/notificationReducer';
import Container from './ThemedComponents/Container';
import useTextInput from '../hooks/useTextInput';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../graphql/mutation';
import { setCommonState } from '../reducers/commonReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
    const username = useTextInput({});
    const password = useTextInput({});
    const dispatch = useDispatch();
    const [loginMutation, {loading}] = useMutation(LOGIN, {errorPolicy: 'all'});
    const handleLogin = async () => {
        try {
            const response = await loginMutation({variables: {user: username.value, password: password.value, pushToken: undefined}});
            const token = response.data?.login;
            if (token) {
                dispatch(addNotification(`Welcome, ${username.value}`, 'success'));
                dispatch(setCommonState({loginToken: token}));
                AsyncStorage.setItem('token', token);
            } else {
                dispatch(addNotification('Wrong username or password', "alert"));
            }

        } catch (e) {
            dispatch(addNotification('Wrong username or password', "alert"));
        }
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
            <Button testID="LoginButton" onPress={handleLogin} mode="contained" style={tyyli.nappi} loading={loading} disabled={loading}>Login</Button>
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
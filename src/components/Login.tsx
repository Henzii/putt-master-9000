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
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { t } = useTranslation();
    const username = useTextInput({});
    const password = useTextInput({});
    const dispatch = useDispatch();
    const [loginMutation, {loading}] = useMutation(LOGIN, {errorPolicy: 'all'});
    const handleLogin = async () => {
        try {
            const response = await loginMutation({variables: {user: username.value, password: password.value, pushToken: undefined}});
            const token = response.data?.login;
            if (token) {
                dispatch(addNotification(t('components.login.welcomeMessage', { name: username.value }), 'success'));
                dispatch(setCommonState({loginToken: token}));
                AsyncStorage.setItem('token', token);
            } else {
                dispatch(addNotification(t('components.login.wrongCredentials'), "alert"));
            }

        } catch (e) {
            dispatch(addNotification(t('components.login.wrongCredentials'), "alert"));
        }
    };
    const setFocus = (next?: React.RefObject<TextInput | null>) => {
        if (!next) return;
        next?.current?.focus();
    };

    return (
        <Container fullWidth>
            <Title>{t('components.login.title')}</Title>
            <Input {...username} testID="user" style={tyyli.nappi} mode='flat' label={t('components.login.usernameLabel')} onSubmitEditing={() => setFocus(password.ref)} />
            <Input {...password} testID="password" style={tyyli.nappi} secureTextEntry label={t('components.login.passwordLabel')} onSubmitEditing={handleLogin} />
            <Button testID="LoginButton" onPress={handleLogin} mode="contained" style={tyyli.nappi} loading={loading} disabled={loading}>{t('components.login.loginButton')}</Button>
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
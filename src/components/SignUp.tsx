import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Alert, StyleSheet, Text } from "react-native";
import { Button, Paragraph, Subheading, TextInput, Title } from 'react-native-paper';
import { ADD_FRIEND, CREATE_USER } from '../graphql/mutation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { addNotification } from '../reducers/notificationReducer';
import { useNavigate } from 'react-router-native';
import Container from './ThemedComponents/Container';
import { GET_ME_WITH_FRIENDS } from '../graphql/queries';
import { useTranslation } from 'react-i18next';

type Props = {
    onClose?: () => void
    isFriendSignUp?: boolean;
}

const SignUp = ({onClose, isFriendSignUp}: Props) => {
    const { t } = useTranslation();
    const [userData, setUserData] = useState({
        name: '',
        password: '',
        password2: '',
        email: '',
    });
    const [createUserMutation] = useMutation(CREATE_USER);
    const [addFriendMutation] = useMutation(ADD_FRIEND, { refetchQueries: [{ query: GET_ME_WITH_FRIENDS }] });
    const dispatch = useDispatch();
    const navi = useNavigate();

    const handleSignUp = async () => {
        if (userData.name.length < 4) {
            Alert.alert(t('common.error'), t('components.signUp.nameTooShort'));
            return;
        }
        if (userData.password.length < 5) {
            Alert.alert(t('common.error'), t('components.signUp.passwordTooShort'));
            return;
        }
        if (userData.password !== userData.password2) {
            Alert.alert(t('common.error'), t('components.signUp.passwordsDontMatch'));
            return;
        }
        try {
            const token = await createUserMutation({
                variables: {
                    name: userData.name,
                    password: userData.password,
                    email: userData.email
                }
            });
            if (isFriendSignUp) {
                dispatch(addNotification(t('components.signUp.accountCreated', { name: userData.name }), 'success'));
                try {
                    await addFriendMutation({
                        variables: {
                            friendName: userData.name.toLowerCase(),
                        }
                    });
                    dispatch(addNotification(t('components.signUp.nowFriends', { name: userData.name }), 'info'));
                } catch {
                    dispatch(addNotification(t('components.signUp.failedToAddFriend', { name: userData.name }), 'alert'));
                } finally{
                    onClose?.();
                }
            } else {
                await AsyncStorage.setItem('token', token.data?.createUser);
                navi("/");
            }

        } catch (e) {
            dispatch(addNotification(t('components.signUp.createUserError', { message: (e as Error).message })));
        }
    };
    return (
        <Container withScrollView style={tyyli.main}>
            <Title>{isFriendSignUp ? t('components.signUp.titleFriend') : t('components.signUp.title')}</Title>
            {(isFriendSignUp) &&
                <>
                    <Paragraph>
                        {t('components.signUp.friendSignUpInfo1')}
                    </Paragraph>
                    <Paragraph>
                        {t('components.signUp.friendSignUpInfo2')}
                    </Paragraph>
                </>}
            <Subheading style={tyyli.subheading}>{t('components.signUp.usernameTitle')}</Subheading>
            <TextInput value={userData.name} autoComplete='off' mode='outlined' label={t('components.signUp.usernameLabel')} onChangeText={(value) => setUserData({ ...userData, name: value })} />
            <Subheading style={tyyli.subheading}>{t('components.signUp.passwordTitle')}</Subheading>
            <TextInput value={userData.password} autoComplete='off' mode='outlined' label={t('components.signUp.passwordLabel')} secureTextEntry onChangeText={(val) => setUserData({ ...userData, password: val })} />
            <TextInput value={userData.password2} autoComplete='off' mode='outlined' label={t('components.signUp.confirmPasswordLabel')} secureTextEntry onChangeText={(val) => setUserData({ ...userData, password2: val })} />
            <Subheading style={tyyli.subheading}>{t('components.signUp.emailTitle')}</Subheading>
            <Text>{t('common.optional')}</Text>
            <TextInput value={userData.email} autoComplete='off' mode='outlined' label={t('screens.feedback.email')} onChangeText={(val) => setUserData({ ...userData, email: val })} />
            <Button style={tyyli.nappi} onPress={handleSignUp} mode='contained'>{t('components.signUp.signUpButton')}</Button>
        </Container>
    );
};

const tyyli = StyleSheet.create({
    main: {
        padding: 30,
    },
    subheading: {
        marginTop: 20,
    },
    nappi: {
        marginTop: 30,
        padding: 10,
        borderRadius: 10,
    }
});

export default SignUp;
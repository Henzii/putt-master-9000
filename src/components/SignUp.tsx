import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Alert, StyleSheet, Text } from "react-native";
import { Button, Paragraph, Subheading, TextInput, Title } from 'react-native-paper';
import { CREATE_USER } from '../graphql/mutation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { addNotification } from '../reducers/notificationReducer';
import { useNavigate, useParams } from 'react-router-native';
import Container from './ThemedComponents/Container';

const SignUp = () => {
    const [userData, setUserData] = useState({
        name: '',
        password: '',
        password2: '',
        email: '',
    });
    const [createUserMutation] = useMutation(CREATE_USER);
    const dispatch = useDispatch();
    const navi = useNavigate();
    const params = useParams();

    const handleSignUp = async () => {
        if (userData.name.length < 4) {
            Alert.alert('Error', 'Name too short!');
            return;
        }
        if (userData.password.length < 5) {
            Alert.alert('Error', 'Password too short. Min 5 letters.');
            return;
        }
        if (userData.password !== userData.password2) {
            Alert.alert('Error', 'Passwords don\'t match!');
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
            // Jos parametrinä on createFriend eli luodaan kaverille tms., ei kirjauduta sillä sisään
            // uudelleenohjaus 'back'
            if (params.param === 'createFriend') {
                dispatch(addNotification(`Account created for ${userData.name}.".`, 'success'));
                navi(-1);
            } else {
                await AsyncStorage.setItem('token', token.data?.createUser);
                navi("/");
            }

        } catch (e) {
            dispatch(addNotification('Error when creating user! ' + (e as Error).message));
        }
    };
    return (
        <Container withScrollView style={tyyli.main}>
            <Title>Signup{(params.param === 'createFriend' ? ' a friend' : '')}</Title>
            {(params.param === 'createFriend') &&
            <>
                <Paragraph>
                    You are creating an account for a friend. Instead of creating accounts for everyone, you should force
                    your friends to use Fudisc.
                </Paragraph>
                <Paragraph>
                    After signing up a friend, you still need to add him/her/it as your friend.
                </Paragraph>
            </>}
            <Subheading style={tyyli.subheading}>Username</Subheading>
            <TextInput value={userData.name} autoComplete='off' mode='outlined' label="Username" onChangeText={(value) => setUserData({ ...userData, name: value })} />
            <Subheading style={tyyli.subheading}>Password</Subheading>
            <TextInput value={userData.password} autoComplete='off' mode='outlined' label="Password" secureTextEntry onChangeText={(val) => setUserData({ ...userData, password: val })} />
            <TextInput value={userData.password2} autoComplete='off' mode='outlined' label="Confirm password" secureTextEntry onChangeText={(val) => setUserData({ ...userData, password2: val })} />
            <Subheading style={tyyli.subheading}>Email</Subheading>
            <Text>Optional</Text>
            <TextInput value={userData.email} autoComplete='off' mode='outlined' label="Email" onChangeText={(val) => setUserData({ ...userData, email: val })} />
            <Button style={tyyli.nappi} onPress={handleSignUp} mode='contained'>Sign up!</Button>
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
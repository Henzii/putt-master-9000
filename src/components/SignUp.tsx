import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import { NativeSyntheticEvent, StyleSheet, Text, TextInputChangeEventData, View } from "react-native";
import { Button, Subheading, TextInput, Title } from 'react-native-paper';
import { CREATE_USER } from '../graphql/mutation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { addNotification } from '../reducers/notificationReducer';
import { useNavigate } from 'react-router-native';

const SignUp = () => {
    const [userData, setUserData] = useState({
        name: '',
        password: '',
        password2: '',
        email: '',
    })
    const [createUserMutation] = useMutation(CREATE_USER);
    const dispatch = useDispatch();
    const navi = useNavigate();

    const validateUserData = () => {
        if (userData.password.length < 5 || userData.password !== userData.password2) return false;
        if (userData.name.length < 3) return false;
        return true;
    }
    const handleSignUp = async () => {
        if (!validateUserData()) return;
        try {
            const token = await createUserMutation({ variables: {
                name: userData.name,
                password: userData.password,
                email: userData.email
            }});
            await AsyncStorage.setItem('token', token.data?.createUser);
            console.log(token.data?.createUser)
            navi("/");
            
        } catch(e) {
            dispatch(addNotification('Error when creating user! ' + (e as Error).message ));
        }
    }
    return (
        <View style={tyyli.main}>
            <Title>Signup</Title>
            <Container>
                <Subheading>Username</Subheading>
                <TextInput value={userData.name} autoComplete={false} mode='outlined' label="Username" onChangeText={(value) => setUserData({...userData, name: value })} />
            </Container>
            <Container>
                <Subheading>Password</Subheading>
                <TextInput value={userData.password} autoComplete={false} mode='outlined' label="Password" secureTextEntry onChangeText={(val) => setUserData({...userData, password: val })} />
                <TextInput value={userData.password2} autoComplete={false} mode='outlined' label="Confirm password" secureTextEntry onChangeText={(val) => setUserData({ ...userData, password2: val })}/>
            </Container>
            <Container>
                <Subheading>Email</Subheading>
                <Text>Optional</Text>
                <TextInput value={userData.email} autoComplete={false} mode='outlined' label="Email" onChangeText={(val) => setUserData({...userData, email: val })} />
            </Container>
            <Button onPress={handleSignUp} mode='contained' disabled={!validateUserData()}>Sign up!</Button>
        </View>
    )
}
const Container = ({ children }: { children: JSX.Element[] | JSX.Element }) => <View style={tyyli.container}>{children}</View>
const tyyli = StyleSheet.create({
    main: {
        width: '100%',
        padding: 20,
    },
    inputs: {
        marginTop: 10,
    },
    container: {
        marginTop: 20,
        marginBottom: 10,
    }
})

export default SignUp;
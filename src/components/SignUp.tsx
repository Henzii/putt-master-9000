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

type Props = {
    onClose?: () => void
    isFriendSignUp?: boolean;
}

const SignUp = ({onClose, isFriendSignUp}: Props) => {
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
            if (isFriendSignUp) {
                dispatch(addNotification(`Account created for ${userData.name}.`, 'success'));
                try {
                    await addFriendMutation({
                        variables: {
                            friendName: userData.name.toLowerCase(),
                        }
                    });
                    dispatch(addNotification(`You're now friends with ${userData.name}.`, 'info'));
                } catch {
                    dispatch(addNotification(`Failed to add ${userData.name} as friend.`, 'alert'));
                } finally{
                    onClose?.();
                }
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
            <Title>Signup{(isFriendSignUp ? ' a friend' : '')}</Title>
            {(isFriendSignUp) &&
                <>
                    <Paragraph>
                        You are creating an account for a friend. Instead of creating accounts for everyone, you should force
                        your friends to use Fudisc.
                    </Paragraph>
                    <Paragraph>
                        Created friend will be added to your friends list automatically.
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
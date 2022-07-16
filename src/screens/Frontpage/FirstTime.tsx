import React, { useEffect, useState } from 'react';
import { Button, Headline, Paragraph, TextInput, Title } from 'react-native-paper';
import Container from '../../components/ThemedComponents/Container';
import UsernameGenerator from 'username-generator';
import Spacer from '../../components/ThemedComponents/Spacer';
import genPassword from '../../utils/passwordGenerator';
import { useNavigate } from 'react-router-native';
import { useMutation } from 'react-apollo';
import { CREATE_USER } from '../../graphql/mutation';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Errors = {
    [key: string]: string
}

export default function FirstTime() {
    const [username, setUsername] = useState(UsernameGenerator.generateUsername());
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState<string | undefined>();
    const [errors, setErrors] = useState<Errors>({});
    const navi = useNavigate();
    const [createUser] = useMutation(CREATE_USER);

    const handleGenRndPass = () => {
        const random = genPassword();
        setPassword1(() => random);
        setPassword2(() => random);
    };
    useEffect(() => {
        if (password1 === '')
            handleGenRndPass();
    }, []);
    const handleSignUp = async () => {
        if (Object.keys(errors).length === 0) {
            const token = await createUser({
                variables: {
                    name: username,
                    password: password1,
                    email,
                }
            });
            await AsyncStorage.setItem('token', token.data?.createUser);
            navi("/");
        }
    };
    const validateForm = () => {
        const newErrors: Errors = {};
        if (username.length < 5) {
            newErrors.userName = 'Username too short';
        }
        if (password1.length < 8) {
            newErrors.password1 = "Password too short!";
        }
        if (password1 !== password2) {
            newErrors.password2 = "Passwords don't match!";
        }
        setErrors(newErrors);
    };
    return (
        <Container withScrollView>
            <Headline>First time using FuDisc?</Headline>
            <Paragraph>
                Before you can start using FuDisc, you&apos;ll have to make some big decisions.
            </Paragraph>
            <Button mode="text" onPress={() => navi('/')} >Already have an account?</Button>
            <Title>Username</Title>
            <Paragraph>
                Pick an unique username. Other players can find you with this. Also use this name to login
                if you ever need to.
            </Paragraph>
            <TextInput
                label={`Username${errors.userName ? ` - ${errors.userName}` : ''}`}
                autoComplete={false}
                mode="outlined"
                onBlur={validateForm}
                error={'userName' in errors}
                value={username}
                onChangeText={(text) => setUsername(text)}
                right={<TextInput.Icon name="reload" onPress={() => setUsername(UsernameGenerator.generateUsername())} />}
            />
            <Spacer />
            <Title>Password</Title>
            <Paragraph>
                Use this password to login
            </Paragraph>
            <TextInput
                label={`Password${errors.password1 ? ` - ${errors.password1}` : ''}`}
                autoComplete={false}
                mode="outlined"
                error={'password1' in errors}
                onBlur={validateForm}
                value={password1}
                onChangeText={(text) => setPassword1(text)}
                right={<TextInput.Icon name="reload" onPress={handleGenRndPass} />}
            />
            <Spacer size={3} />
            <TextInput
                label={`Verify password${errors.password2 ? ` - ${errors.password2}` : ''}`}
                autoComplete={false}
                onBlur={validateForm}
                error={'password2' in errors}
                mode="outlined"
                value={password2}
                onChangeText={(text) => setPassword2(text)}
            />
            <Spacer />
            <Title>Email (Optional)</Title>
            <Paragraph>
                Used only for resetting forgotten passwords.
            </Paragraph>
            <TextInput
                label="Email"
                autoComplete={false}
                mode="outlined"
                dense
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <Spacer />
            <Button mode="contained" disabled={Object.keys(errors).length > 0} onPress={handleSignUp} >Sign up!</Button>
        </Container>
    );
}
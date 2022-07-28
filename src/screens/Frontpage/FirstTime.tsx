import React, { useEffect, useState } from 'react';
import { Button, Headline, Paragraph, TextInput, Title } from 'react-native-paper';
import Container from '../../components/ThemedComponents/Container';
import UsernameGenerator from 'username-generator';
import Spacer from '../../components/ThemedComponents/Spacer';
import genPassword from '../../utils/passwordGenerator';
import { useNavigate } from 'react-router-native';
import { useLazyQuery, useMutation } from 'react-apollo';
import { CREATE_USER } from '../../graphql/mutation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SEARCH_USER } from '../../graphql/queries';
import { addNotification } from '../../reducers/notificationReducer';
import { useDispatch } from 'react-redux';

type Errors = {
    [key: string]: string
}

export default function FirstTime() {
    const [username, setUsername] = useState(UsernameGenerator.generateUsername());
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState<string | undefined>();
    const [errors, setErrors] = useState<Errors>({});
    const [searchUser, { data, loading }] = useLazyQuery(SEARCH_USER);
    const navi = useNavigate();
    const [createUser] = useMutation(CREATE_USER);
    const dispatch = useDispatch();

    const handleGenRndPass = () => {
        const random = genPassword();
        setPassword1(() => random);
        setPassword2(() => random);
    };
    useEffect(() => {
        if (password1 === '')
            handleGenRndPass();
    }, []);
    useEffect(() => {
        if (!loading) {
            if (data?.searchUser?.users?.find((user: { name: string }) => user.name.toLowerCase() === username.toLowerCase())) {
                setErrors({ ...errors, userName: 'already taken!' });
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { userName, ...rest } = errors;
                setErrors({ ...rest });
            }
        }
    }, [data, loading]);
    const handleSignUp = async () => {
        if (Object.keys(errors).length === 0) {
            try {
                const token = await createUser({
                    variables: {
                        name: username,
                        password: password1,
                        email,
                    }
                });
                await AsyncStorage.setItem('token', token.data?.createUser);
                dispatch(addNotification(`Welcome to FuDisc, ${username}!`, 'success'));
                navi("/");
            } catch {
                dispatch(addNotification('Error when signing up', 'alert'));
            }
        }
    };
    const validateForm = () => {
        const newErrors: Errors = {};
        if (password1.length < 8) {
            newErrors.password1 = "Password too short!";
        }
        if (password1 !== password2) {
            newErrors.password2 = "Passwords don't match!";
        }
        setErrors(newErrors);
    };
    const handleValidateUsername = async () => {
        if (username.length < 5) {
            setErrors({ ...errors, userName: 'too short, min 5 letters!' });
        } else {
            searchUser({ variables: { search: username } });
        }
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
                Pick a unique username. Other players can find you with this. Also use this name to login
                if you ever need to.
            </Paragraph>
            <TextInput
                label={`Username${errors.userName ? ` - ${errors.userName}` : ''}`}
                autoComplete={false}
                mode="outlined"
                onBlur={handleValidateUsername}
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

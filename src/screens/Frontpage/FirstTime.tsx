import React, { useEffect, useState } from 'react';
import { Button, Headline, Paragraph, ProgressBar, TextInput, Title } from 'react-native-paper';
import Container from '../../components/ThemedComponents/Container';
import UsernameGenerator from 'username-generator';
import Spacer from '../../components/ThemedComponents/Spacer';
import genPassword from '../../utils/passwordGenerator';
import { useNavigate } from 'react-router-native';
import { useLazyQuery, useMutation } from '@apollo/client';
import { CREATE_USER } from '../../graphql/mutation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SEARCH_USER } from '../../graphql/queries';
import { addNotification } from '../../reducers/notificationReducer';
import { useDispatch } from 'react-redux';
import useTextInput from '../../hooks/useTextInput';

type Errors = {
    [key: string]: string
}

const PROGRESS_BAR_STEPS = [
    0.1,
    0.33,
    0.66,
    1
];

export default function FirstTime() {
    const [searchUser] = useLazyQuery(SEARCH_USER);

    const username = useTextInput({ callBackDelay: 300, defaultValue: '' }, async (value) => {
        if (value) {
            const response = await searchUser({ variables: { search: value.toLowerCase() } });
            const userExists = response.data.searchUser?.users?.some((user: { name: string }) => user.name.toLowerCase() === value.toLowerCase());
            if (userExists) {
                setErrors({ ...errors, userName: 'already taken!' });
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { userName, ...rest } = errors;
                setErrors(rest);
            }
        }
    });
    const [step, setStep] = useState(0);
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState<string | undefined>();
    const [errors, setErrors] = useState<Errors>({});
    const navi = useNavigate();
    const [createUser] = useMutation(CREATE_USER);
    const dispatch = useDispatch();

    const handleGenRndPass = () => {
        const random = genPassword();
        setPassword1(() => random);
        setPassword2(() => random);
    };

    useEffect(() => {
        username.onChangeText(UsernameGenerator.generateUsername());
    }, []);

    useEffect(() => {
        if (password1 === '')
            handleGenRndPass();
    }, []);

    const handleSignUp = async () => {
        if (Object.keys(errors).length === 0) {
            try {
                const token = await createUser({
                    variables: {
                        name: username.value,
                        password: password1,
                        email,
                    }
                });
                await AsyncStorage.setItem('token', token.data?.createUser);
                dispatch(addNotification(`Welcome to FuDisc, ${username.value}!`, 'success'));
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

    return (
        <Container withScrollView>
            <ProgressBar progress={PROGRESS_BAR_STEPS[step]} />
            <Spacer />
            <Headline>Welcome to FuDisc!</Headline>
            {step === 0 && (
                <>
                    <Paragraph>
                        Looks like you are new here. Before you can start playing, you need to create an account. It&apos;ll only take a minute!
                    </Paragraph>
                    <Paragraph>
                        If you already have an account, you can go directly to the login screen. Or if you&apos;re in a hurry, you can just randomize everything and get started right away.
                    </Paragraph>
                    <Spacer />
                    <Button mode="contained-tonal" onPress={() => navi('/')} >To the login screen!</Button>
                    <Spacer size={5} />
                    <Button mode="outlined" onPress={handleSignUp}>Shut up and let me in</Button>
                    <Spacer size={15} />
                    <Button mode="contained" onPress={() => setStep(1)} testID="create-account">I want to create a proper account</Button>
                </>
            )}
            {step === 1 && (
                <>
                    <Title>Username</Title>
                    <Paragraph>
                        Pick a unique username. Other players can find you with this. Also use this name to login
                        to the website (fudisc.henzi.fi). This name can be changed afterwards on the website.
                    </Paragraph>
                    <Spacer />
                    <TextInput
                        label={`Username${errors.userName ? ` - ${errors.userName}` : ''}`}
                        autoComplete='off'
                        mode="outlined"
                        testID='username'
                        error={'userName' in errors}
                        right={<TextInput.Icon icon="reload" onPress={() => username.onChangeText(UsernameGenerator.generateUsername())} />}
                        {...username}
                    />
                    <Spacer />
                    <Button
                        mode="contained"
                        disabled={'userName' in errors}
                        onPress={() => setStep(2)}
                        testID="nextStep"
                    >
                        Next
                    </Button>
                </>
            )}
            {step === 2 && (
                <>
                    <Title>Password</Title>
                    <Paragraph>
                        Enter a password. This password is used to login to the app and the website.
                    </Paragraph>
                    <Spacer />
                    <TextInput
                        label={`Password${errors.password1 ? ` - ${errors.password1}` : ''}`}
                        autoComplete='off'
                        mode="outlined"
                        testID="password1"
                        error={'password1' in errors}
                        onBlur={validateForm}
                        value={password1}
                        onChangeText={(text) => setPassword1(text)}
                        right={<TextInput.Icon icon="reload" onPress={handleGenRndPass} />}
                    />
                    <Spacer size={3} />
                    <TextInput
                        label={`Verify password${errors.password2 ? ` - ${errors.password2}` : ''}`}
                        autoComplete='off'
                        onBlur={validateForm}
                        error={'password2' in errors}
                        testID="password2"
                        mode="outlined"
                        value={password2}
                        onChangeText={(text) => setPassword2(text)}
                    />
                    <Spacer />
                    <Button
                        mode="contained"
                        disabled={'password1' in errors || 'password2' in errors}
                        onPress={() => setStep(3)}
                        testID="nextStep"
                    >Next</Button>
                </>)}
            {step === 3 && (
                <>
                    <Title>Email (Optional)</Title>
                    <Paragraph>
                        Email is only used for password recovery and notifications. It is not mandatory, so it&apos; okay to leave it empty.
                    </Paragraph>
                    <TextInput
                        label="Email"
                        autoComplete='off'
                        mode="outlined"
                        dense
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                    <Spacer />
                    <Paragraph>
                        That&apos;s it! You can now start playing.
                    </Paragraph>
                    <Spacer />
                    <Button mode="contained" disabled={Object.keys(errors).length > 0} onPress={handleSignUp} testID="signup">Sign up!</Button>
                    <Spacer size={5} />
                    <Button mode="contained-tonal" onPress={() => setStep(0)}>Back to start</Button>
                </>
            )
            }
        </Container >
    );
}

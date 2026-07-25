import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ProgressBar, Text, TextInput } from 'react-native-paper';
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
import WebLinkButton from '@components/WebLinkButton';

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
    const { t } = useTranslation();
    const [searchUser] = useLazyQuery(SEARCH_USER);

    const username = useTextInput({ callBackDelay: 300, defaultValue: '' }, async (value) => {
        if (value) {
            const response = await searchUser({ variables: { search: value.toLowerCase() } });
            const userExists = response.data.searchUser?.users?.some((user: { name: string }) => user.name.toLowerCase() === value.toLowerCase());
            if (userExists) {
                setErrors({ ...errors, userName: t('screens.firstTime.usernameAlreadyTaken') });
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
                dispatch(addNotification(t('screens.firstTime.welcomeToFudisc', { name: username.value }), 'success'));
                navi("/");
            } catch {
                dispatch(addNotification(t('screens.firstTime.errorSigningUp'), 'alert'));
            }
        }
    };
    const validateForm = () => {
        const newErrors: Errors = {};
        if (password1.length < 8) {
            newErrors.password1 = t('screens.firstTime.passwordTooShort');
        }
        if (password1 !== password2) {
            newErrors.password2 = t('screens.firstTime.passwordsDontMatch');
        }
        setErrors(newErrors);
    };

    return (
        <Container withScrollView>
            <ProgressBar progress={PROGRESS_BAR_STEPS[step]} />
            <Spacer />
            {step === 0 && (
                <>
                    <Text variant="headlineMedium">{t('screens.firstTime.welcomeTitle')}</Text>
                    <Text variant="bodyMedium">
                        {t('screens.firstTime.newUserIntro')}
                    </Text>
                    <Spacer size={10} />
                    <Text variant="headlineSmall">{t('screens.firstTime.alreadyHaveAccount')}</Text>
                    <Text variant="bodyMedium">
                        {t('screens.firstTime.existingAccountInfo')}
                    </Text>
                    <Spacer />
                    <Button mode="contained-tonal" onPress={() => navi('/login')} >{t('screens.firstTime.toLoginScreen')}</Button>
                    <Spacer size={5} />
                    <WebLinkButton path="restore">
                        {t('screens.firstTime.forgotPassword')}
                    </WebLinkButton>
                    <Spacer size={15} />
                    <Text variant="headlineSmall">{t('screens.firstTime.createProperAccount')}</Text>
                    <Text variant="bodyMedium">
                        {t('screens.firstTime.createAccountInfo')}
                    </Text>
                    <Spacer />
                    <Button mode="contained" onPress={() => setStep(1)} testID="create-account">{t('screens.firstTime.createProperAccount')}</Button>
                    <Spacer size={15} />
                    <Text variant="headlineSmall">{t('screens.firstTime.shutUpLetMeIn')}</Text>
                    <Text variant="bodyMedium">
                        {t('screens.firstTime.shutUpLetMeInInfo')}
                    </Text>
                    <Spacer />
                    <Button mode="outlined" onPress={handleSignUp}>{t('screens.firstTime.shutUpLetMeIn')}</Button>
                </>
            )}
            {step === 1 && (
                <>
                    <Text variant="headlineSmall">{t('screens.firstTime.usernameTitle')}</Text>
                    <Text variant="bodyMedium">
                        {t('screens.firstTime.usernameHelp')}
                    </Text>
                    <Spacer />
                    <TextInput
                        label={`${t('screens.firstTime.usernameTitle')}${errors.userName ? ` - ${errors.userName}` : ''}`}
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
                        {t('common.next')}
                    </Button>
                </>
            )}
            {step === 2 && (
                <>
                    <Text variant="headlineSmall">{t('screens.firstTime.passwordTitle')}</Text>
                    <Text variant="bodyMedium">
                        {t('screens.firstTime.passwordHelp')}
                    </Text>
                    <Spacer />
                    <TextInput
                        label={`${t('screens.firstTime.passwordTitle')}${errors.password1 ? ` - ${errors.password1}` : ''}`}
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
                        label={`${t('screens.firstTime.verifyPassword')}${errors.password2 ? ` - ${errors.password2}` : ''}`}
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
                    >{t('common.next')}</Button>
                </>)}
            {step === 3 && (
                <>
                    <Text variant="headlineSmall">{t('screens.firstTime.emailTitle')}</Text>
                    <Text variant="bodyMedium">
                        {t('screens.firstTime.emailHelp')}
                    </Text>
                    <TextInput
                        label={t('screens.firstTime.emailTitle')}
                        autoComplete='off'
                        mode="outlined"
                        dense
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                    <Spacer />
                    <Text variant="bodyMedium">
                        {t('screens.firstTime.signUpComplete')}
                    </Text>
                    <Spacer />
                    <Button mode="contained" disabled={Object.keys(errors).length > 0} onPress={handleSignUp} testID="signup">{t('screens.frontpage.signUp')}</Button>
                    <Spacer size={5} />
                    <Button mode="contained-tonal" onPress={() => setStep(0)}>{t('screens.firstTime.backToStart')}</Button>
                </>
            )
            }
        </Container >
    );
}

import Container from '@components/ThemedComponents/Container';
import Spacer from '@components/ThemedComponents/Spacer';
import { openWebsite } from '@components/WebLinkButton';
import { useLogin } from '@hooks/session/useLogin';
import useTextInput from '@hooks/useTextInput';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, List, Text, TextInput, useTheme } from 'react-native-paper';
import { useNavigate } from 'react-router-native';
import firstTimeLaunched from 'src/utils/firstTimeLaunched';

const Login = () => {
    const { t } = useTranslation();
    const { login, loading } = useLogin();
    const navi = useNavigate();
    const theme = useTheme();

    const userName = useTextInput({ defaultValue: '' });
    const password = useTextInput({ defaultValue: '' });

    useEffect(() => {
        (async function IIFE() {
            if (await firstTimeLaunched()) {
                navi('/firstTime');
            }
        })();
    }, []);

    const handleLogin = async () => {
        await login(userName.value, password.value);
    };

    return (
        <Container withScrollView fullWidth noPadding>
            <Container>
                <Text variant="headlineMedium">{t('components.login.title')}</Text>
                <Spacer />
                <Text variant="titleMedium">{t('components.login.usernameLabel')}</Text>
                <TextInput {...userName} mode="outlined" onSubmitEditing={() => password.ref?.current?.focus()} />
                <Spacer size={6} />
                <Text variant="titleMedium">{t('components.login.passwordLabel')}</Text>
                <TextInput {...password} mode="outlined" secureTextEntry onSubmitEditing={handleLogin} />
                <Spacer size={6} />
                <Button mode="contained" onPress={handleLogin} loading={loading}>
                    {t('components.login.loginButton')}
                </Button>
                <Spacer />
            </Container>
            <List.Section>
                <List.Subheader style={{ fontSize: 18, fontWeight: '600' }}>
                    {t('components.login.otherOptions')}
                </List.Subheader>
                <List.Item
                    title={t('components.login.firstTimeWizard')}
                    onPress={() => navi('/firstTime')}
                    description="Run the first-time setup wizard"
                    style={{ backgroundColor: theme.colors.surfaceVariant }}
                />
                <List.Item
                    title={t('components.signUp.title')}
                    onPress={() => navi('/signUp')}
                    description="Create a new account"
                />
                <List.Item
                    title={t('components.login.forgotPassword')}
                    right={() => <List.Icon icon="open-in-new" />}
                    onPress={() => openWebsite({ path: 'restore' })}
                    description="Opens a web page where you can reset your password"
                    style={{ backgroundColor: theme.colors.surfaceVariant }}
                />
            </List.Section>

        </Container>
    );
};

export default Login;
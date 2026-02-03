import React from 'react';
import { Button, Paragraph, Title, Text } from 'react-native-paper';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useNavigate } from 'react-router-native';
import { useTranslation } from 'react-i18next';
import Container from './ThemedComponents/Container';

type Props = {
    errorMessage: string;
    showBackToFrontpage?: boolean;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>
}
const ErrorScreen = ({errorMessage, children, style, showBackToFrontpage = true}: Props) => {
    const navi = useNavigate();
    const { t } = useTranslation();
    return (
        <Container fullWidth style={style}>
            <Text variant="headlineMedium" style={styles.shrug}>
            ¯\_(ツ)_/¯
            </Text>
            <Title testID='ErrorTitle'>{t('components.errorScreen.title')}</Title>
            <Paragraph>
                {errorMessage}
            </Paragraph>
            {showBackToFrontpage && (
                <Paragraph style={styles.button}>
                    <Button onPress={() => navi('/')}>{t('components.errorScreen.backToFrontpage')}</Button>
                </Paragraph>
            )}
            {children}
        </Container>
    );
};

const styles = StyleSheet.create({
    button: {
        marginTop: 20
    },
    shrug: {
        textAlign: 'center',
    }
});

export default ErrorScreen;
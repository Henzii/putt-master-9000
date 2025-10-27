import React from 'react';
import { Button, Paragraph, Title, Text } from 'react-native-paper';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useNavigate } from 'react-router-native';
import Container from './ThemedComponents/Container';

type Props = {
    errorMessage: string;
    showBackToFrontpage?: boolean;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>
}
const ErrorScreen = ({errorMessage, children, style, showBackToFrontpage = true}: Props) => {
    const navi = useNavigate();
    return (
        <Container fullWidth style={style}>
            <Text variant="headlineMedium" style={styles.shrug}>
            ¯\_(ツ)_/¯
            </Text>
            <Title testID='ErrorTitle'>Error</Title>
            <Paragraph>
                {errorMessage}
            </Paragraph>
            {showBackToFrontpage && (
                <Paragraph style={styles.button}>
                    <Button onPress={() => navi('/')}>Back to the frontpage</Button>
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
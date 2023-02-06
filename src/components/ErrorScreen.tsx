import React from 'react';
import { Button, Paragraph, Title } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useNavigate } from 'react-router-native';
import Container from './ThemedComponents/Container';

const ErrorScreen = ({ errorMessage}: { errorMessage: string }) => {
    const navi = useNavigate();
    return (
        <Container fullWidth>
            <Paragraph style={{ textAlign: 'center', fontSize: 30, padding: 30, fontWeight: 'bold' }}>
            ¯\_(ツ)_/¯
            </Paragraph>
            <Title testID='ErrorTitle'>Error</Title>
            <Paragraph>
                {errorMessage}
            </Paragraph>
            <Paragraph style={styles.button}>
                <Button onPress={() => navi('/')}>Back to frontpage</Button>
            </Paragraph>
        </Container>
    );
};

const styles = StyleSheet.create({
    button: {
        marginTop: 20
    }
});

export default ErrorScreen;
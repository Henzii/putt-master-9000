import React from 'react';
import { Paragraph, Title } from 'react-native-paper';
import Container from './ThemedComponents/Container';

const ErrorScreen = ({ errorMessage}: { errorMessage: string }) => {
    return (
        <Container fullWidth>
            <Paragraph style={{ textAlign: 'center', fontSize: 30, padding: 30, fontWeight: 'bold' }}>
            ¯\_(ツ)_/¯
            </Paragraph>
            <Title>Error</Title>
            <Paragraph>
                {errorMessage}
            </Paragraph>
        </Container>
    );
};

export default ErrorScreen;
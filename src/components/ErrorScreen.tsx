import React from 'react';
import { Paragraph, Title } from 'react-native-paper';
import { Text } from 'react-native';
import { Link } from 'react-router-native';
import Container from './ThemedComponents/Container';

const ErrorScreen = ({ errorMessage}: { errorMessage: string }) => {
    return (
        <Container fullWidth>
            <Paragraph style={{ textAlign: 'center', fontSize: 30, padding: 30, fontWeight: 'bold' }}>
            ¯\_(ツ)_/¯
            </Paragraph>
            <Title testID='ErrorTitle'>Error</Title>
            <Paragraph>
                {errorMessage}
            </Paragraph>
            <Paragraph>
                <Link to="/"><Text>Back to frontpage</Text></Link>
            </Paragraph>
        </Container>
    );
};

export default ErrorScreen;
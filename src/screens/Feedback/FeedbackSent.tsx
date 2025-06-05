import React from 'react';
import { Button, Headline, Paragraph } from "react-native-paper";
import Container from "../../components/ThemedComponents/Container";
import Spacer from '../../components/ThemedComponents/Spacer';
import { useNavigate } from 'react-router-native';

const FeedbackSent = ({onReset}: {onReset: () => void}) => {
    const navigate = useNavigate();
    return (
        <Container>
            <Headline>Feedback sent</Headline>
            <Paragraph>
                Thank you for your feedback! We appreciate your input and will review it shortly.
            </Paragraph>
            <Spacer size={20} />
            <Button mode="contained-tonal" onPress={onReset}>Send another</Button>
            <Spacer size={4} />
            <Button mode="contained" onPress={() => navigate('/')}>Frontpage</Button>
        </Container>
    );
};

export default FeedbackSent;
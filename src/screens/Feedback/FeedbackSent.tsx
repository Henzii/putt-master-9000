import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Headline, Paragraph } from "react-native-paper";
import Container from "../../components/ThemedComponents/Container";
import Spacer from '../../components/ThemedComponents/Spacer';
import { useNavigate } from 'react-router-native';

const FeedbackSent = ({onReset}: {onReset: () => void}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <Container>
            <Headline>{t('screens.feedback.thankYouTitle')}</Headline>
            <Paragraph>
                {t('screens.feedback.thankYouMessage')}
            </Paragraph>
            <Spacer size={20} />
            <Button mode="contained-tonal" onPress={onReset}>Send another</Button>
            <Spacer size={4} />
            <Button mode="contained" onPress={() => navigate('/')}>Frontpage</Button>
        </Container>
    );
};

export default FeedbackSent;
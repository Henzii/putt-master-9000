import React, { useState } from 'react';
import Container from "../../components/ThemedComponents/Container";
import { Button, Headline, TextInput, Title } from 'react-native-paper';
import Spacer from '../../components/ThemedComponents/Spacer';
import FeedbackSent from './FeedbackSent';
import { useMutation } from '@apollo/client';
import { SEND_FEEDBACK } from '../../graphql/mutation';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../reducers/notificationReducer';
import { useTranslation } from 'react-i18next';
import { useSessionV2 } from '@hooks/session/useSessionV2';

const Feedback = () => {
    const { t } = useTranslation();
    const {user} = useSessionV2();
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');
    const [feedbackSent, setFeedbackSent] = useState(false);
    const [sendFeedback] = useMutation(SEND_FEEDBACK);
    const dispatch = useDispatch();

    const handleFeedbackSubmission = async () => {
        try {
            await sendFeedback({
                variables: {
                    subject,
                    text,
                    email: user.email || ''
                }
            });
            setFeedbackSent(true);
        } catch (e) {
            dispatch(addNotification(t('screens.feedback.sendFailed'), 'alert'));
        } finally {
            setSubject('');
            setText('');
        }
    };

    if (feedbackSent) {
        return <FeedbackSent onReset={() => setFeedbackSent(false)} />;
    }

    return (
        <Container>
            <Headline>{t('screens.feedback.title')}</Headline>
            <Spacer />
            <Title>{t('screens.feedback.subject')}</Title>
            <TextInput
                mode="outlined"
                placeholder={t('screens.feedback.subjectPlaceholder')}
                value={subject}
                onChangeText={setSubject}
            />
            <Spacer />
            <Title>
                {t('screens.feedback.email')}
            </Title>
            <TextInput
                mode="outlined"
                defaultValue={user.email ?? ''}
                placeholder={t('screens.feedback.emailPlaceholder')}
            />
            <Spacer />
            <Title>{t('screens.feedback.message')}</Title>
            <TextInput
                mode="outlined"
                multiline
                value={text}
                onChangeText={setText}
                numberOfLines={10}
                placeholder={t('screens.feedback.messagePlaceholder')}
            />
            <Spacer />
            <Button
                mode="contained"
                disabled={!subject || !text}
                onPress={handleFeedbackSubmission}
            >{t('screens.feedback.submitButton')}</Button>
        </Container>
    );
};

export default Feedback;
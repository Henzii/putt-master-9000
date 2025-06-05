import React, { useState } from 'react';
import Container from "../../components/ThemedComponents/Container";
import { Button, Headline, TextInput, Title } from 'react-native-paper';
import Spacer from '../../components/ThemedComponents/Spacer';
import { useSession } from '../../hooks/useSession';
import FeedbackSent from './FeedbackSent';
import { useMutation } from '@apollo/client';
import { SEND_FEEDBACK } from '../../graphql/mutation';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../reducers/notificationReducer';

const Feedback = () => {
    const me = useSession();
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
                    email: me.email || ''
                }
            });
            setFeedbackSent(true);
        } catch (e) {
            dispatch(addNotification('Failed to send feedback. Please try again later.', 'alert'));
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
            <Headline>Leave feedback</Headline>
            <Spacer />
            <Title>Subject</Title>
            <TextInput
                mode="outlined"
                placeholder="Enter feedback subject"
                value={subject}
                onChangeText={setSubject}
            />
            <Spacer />
            <Title>
                Email
            </Title>
            <TextInput
                mode="outlined"
                defaultValue={me.email}
                placeholder='Enter your email (optional)'
            />
            <Spacer />
            <Title>Message</Title>
            <TextInput
                mode="outlined"
                multiline
                value={text}
                onChangeText={setText}
                numberOfLines={10}
                placeholder="Enter your feedback here"
            />
            <Spacer />
            <Button
                mode="contained"
                disabled={!subject || !text}
                onPress={handleFeedbackSubmission}
            >Leave feedback</Button>
        </Container>
    );
};

export default Feedback;
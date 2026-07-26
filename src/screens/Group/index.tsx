import React, { useState } from 'react';
import { Alert, StyleSheet, View } from "react-native";
import { Button, Chip, Headline, Paragraph, TextInput, Title } from "react-native-paper";
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Container from '../../components/ThemedComponents/Container';
import { useQuery } from '@apollo/client';
import { GET_GROUP_MEMBERS } from '../../graphql/queries';
import Loading from '../../components/Loading';
import Spacer from '../../components/ThemedComponents/Spacer';
import { useUpdateSettings } from '../../hooks/useUpdateSettings';
import { addNotification } from '../../reducers/notificationReducer';
import WebLinkButton from '@components/WebLinkButton';
import { useSessionV2 } from '@hooks/session/useSessionV2';
import ErrorScreen from '@components/ErrorScreen';

const Group = () => {
    const { t } = useTranslation();
    const { user} = useSessionV2();
    const { data, loading, refetch, error } = useQuery(GET_GROUP_MEMBERS, {});
    const updateSettings = useUpdateSettings();
    const dispatch = useDispatch();

    const handleGroupChange = async (groupName: string) => {
        if (!await updateSettings({ variables: { groupName } })) {
            dispatch(addNotification(t('screens.group.groupNotSet'), 'alert'));
        } else {
            if (groupName) {
                dispatch(addNotification(t('screens.group.joinedGroup', { name: groupName }), 'success'));
            } else {
                dispatch(addNotification(t('screens.group.leftGroup'), 'warning'));
            }

            refetch();
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <ErrorScreen errorMessage={"Error while fetching group members"} />;
    }

    const groupName = user.groupName;

    return (
        <Container>
            {groupName ? (
                <>
                    <Headline>{groupName}</Headline>
                    <Spacer />
                    <Title>{t('screens.group.membersTitle')}</Title>
                    <Spacer />
                    <View style={styles.container}>
                        {data.getGroupMembers.map((member: { id: string, name: string }) => (
                            <Chip key={member.id} icon="account">
                                {member.name}
                            </Chip>
                        ))}
                    </View>
                    <Spacer />
                </>
            ) : (
                <>
                    <Headline>{t('screens.group.notInGroup')}</Headline>
                    <Paragraph>
                        {t('screens.group.notInGroupInfo')}
                    </Paragraph>
                </>
            )}
            {!groupName && (<>
                <Spacer />
                <JoinGroup onJoinGroup={handleGroupChange} />
            </>)}
            <Spacer />
            <Title>{t('screens.group.websiteTitle')}</Title>
            <Paragraph>{t('screens.group.websiteInfo')}</Paragraph>
            <WebLinkButton />
            {groupName && <LeaveGroup onLeaveGroup={() => handleGroupChange('')} />}
        </Container>
    );
};

const LeaveGroup = ({ onLeaveGroup }: { onLeaveGroup: () => void }) => {
    const { t } = useTranslation();
    const handleLeaveGroupClick = () => {
        Alert.alert(
            t('screens.group.leaveGroupTitle'),
            t('screens.group.leaveGroupConfirmMessage'),
            [
                {
                    text: t('screens.group.leaveGroupButton'),
                    onPress: () => {
                        onLeaveGroup();
                    },
                },
                { text: t('common.cancel'), isPreferred: true},
            ],
            { cancelable: true }
        );
    };

    return (
        <>
            <Title>{t('screens.group.leaveGroupTitle')}</Title>
            <Paragraph>
                {t('screens.group.leaveGroupInfo')}
            </Paragraph>
            <Spacer />
            <Button onPress={handleLeaveGroupClick} mode="contained">{t('screens.group.leaveGroupButton')}</Button>
        </>
    );
};

const JoinGroup = ({ onJoinGroup }: { onJoinGroup: (groupName: string) => void }) => {
    const { t } = useTranslation();
    const [groupName, setGroupName] = useState('');
    return (
        <>
            <Title>{t('screens.group.enterGroupName')}</Title>
            <TextInput
                value={groupName}
                onChangeText={setGroupName}
                mode="outlined"
            />
            <Spacer />
            <Button onPress={() => onJoinGroup(groupName)} mode="contained">{t('common.join')}</Button>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        maxWidth: '100%',
        flexWrap: 'wrap',
        flexDirection: 'row',
        gap: 8,
    }
});

export default Group;
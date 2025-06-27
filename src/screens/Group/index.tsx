import React from 'react';
import { Linking, StyleSheet, View } from "react-native";
import { Button, Chip, Headline, Paragraph, TextInput, Title } from "react-native-paper";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../utils/store';
import Container from '../../components/ThemedComponents/Container';
import { useQuery } from '@apollo/client';
import { GET_GROUP_MEMBERS } from '../../graphql/queries';
import Loading from '../../components/Loading';
import Spacer from '../../components/ThemedComponents/Spacer';
import ErrorScreen from '../../components/ErrorScreen';
import useTextInput from '../../hooks/useTextInput';
import { useUpdateSettings } from '../../hooks/useUpdateSettings';
import { addNotification } from '../../reducers/notificationReducer';
import { setUser } from '../../reducers/userReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Group = () => {
    const user = useSelector((state: RootState) => state.user);
    const { data, loading, error, refetch } = useQuery(GET_GROUP_MEMBERS, {});
    const updateSettings = useUpdateSettings();
    const dispatch = useDispatch();

    const handleGroupChange = async (groupName: string) => {
        if (!user.isLoggedIn) return;
        if (!await updateSettings({ variables: { groupName } })) {
            dispatch(addNotification('Error! Group not set :(', 'alert'));
        } else {
            dispatch(addNotification('Group name changed to ' + groupName, 'info'));
            dispatch(setUser({ ...user, groupName }));
            refetch();
        }
    };

    const handleOpenWebsite = async () => {
        const token = await AsyncStorage.getItem('token');
        Linking.openURL(`https://fudisc.henzi.fi/login?token=${token}`);
    };

    const newGroup = useTextInput({
        defaultValue: user.isLoggedIn ? user.groupName ?? '' : '',
        callBackDelay: 1000
    }, handleGroupChange);

    if (!user.isLoggedIn || error) return <ErrorScreen errorMessage="Something is not working properly ..." />;

    if (loading) {
        return <Loading />;
    }

    const groupName = user.groupName;

    return (
        <Container>
            {groupName ? (
                <>
                    <Headline>{groupName}</Headline>
                    <Spacer />
                    <Title>Members</Title>
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
                    <Headline>Not in a group</Headline>
                    <Paragraph>
                    Set a group name to connect with your friends. This links you all together in the same group,
                    so you can compare scores and compete with each other. You&apos;ll be able to view your group&apos;s
                    results and competition standings on the website.
                    </Paragraph>
                </>
            )}
            <Title>Enter group name</Title>
            <TextInput
                {...newGroup}
                mode="outlined"
                right={groupName && groupName === newGroup.value ? <TextInput.Icon icon="check-circle-outline" color="green" /> : undefined}

            />
            <Spacer />
            <Title>Website</Title>
            <Paragraph>Group standing, scores etc. can be found on the the website</Paragraph>
            <Button onPress={handleOpenWebsite} mode="text">httsp://fudisc.henzi.fi</Button>
        </Container>
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
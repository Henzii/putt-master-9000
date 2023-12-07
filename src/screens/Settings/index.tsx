import React, { useState } from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { Button, Paragraph, TextInput, Title, TouchableRipple } from 'react-native-paper';
import Container from '../../components/ThemedComponents/Container';
import Divider from '../../components/ThemedComponents/Divider';
import appInfo from '../../../app.json';
import useMe from '../../hooks/useMe';
import { useMutation } from '@apollo/client';
import { DELETE_ACCOUNT } from '../../graphql/mutation';
import { useNavigate } from 'react-router-native';
import ChangePassword from './ChangePassword';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../reducers/notificationReducer';
import { SingleSwitch } from '../../components/LocalSettings';
import Spacer from '../../components/ThemedComponents/Spacer';
import { AccountType } from '../../types/user';

const Settings = () => {
    const { me, updateSettings, logout } = useMe();
    const navi = useNavigate();
    const [deleteAccountMutation] = useMutation(DELETE_ACCOUNT);
    const [groupName, setGroupName] = useState(me?.groupName);
    const dispatch = useDispatch();
    const handleBlockFriendsChange = () => {
        updateSettings({ blockFriendRequests: !me?.blockFriendRequests });
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleBlockStatsSharingChange = () => {
        updateSettings({ blockStatsSharing: !me?.blockStatsSharing });
    };

    const handleDeleteAccount = async () => {
        // Poistetaan tunnukset
        const res = await deleteAccountMutation();
        if (res.data.deleteAccount) {
            // Kirjaudutaan ulos
            logout();
            navi('/');
        }
    };
    const handlePasswordChange = async (newPassword: string) => {
        if (await updateSettings({ password: newPassword })) {
            dispatch(addNotification('Password changed!', 'success'));
        } else {
            dispatch(addNotification('Error! Password not changed! :/', 'alert'));
        }
    };
    const handleSetGroup = async () => {
        if (!(await updateSettings({ groupName: groupName }))) {
            dispatch(addNotification('Error! Group not set :(', 'alert'));
        } else {
            if (!groupName) {
                dispatch(addNotification('Group name cleared', 'warning'));
            } else {
                dispatch(addNotification('Group name changed to ' + groupName, 'info'));
            }
        }
    };
    const confirmDelete = () => {
        Alert.alert(
            'Delete account?',
            'Deleted account cannot be restored!',
            [
                {
                    text: 'Cancel',
                },
                {
                    text: 'Delete',
                    onPress: handleDeleteAccount
                }
            ]
        );
    };

    const isSavedGroupName = me?.groupName === groupName;

    return (
        <Container noPadding withScrollView noFlex>
            <Title style={{ marginTop: 10, marginLeft: 15 }}>Friends</Title>

            <SingleSwitch testID="blockFriendRequestsSwitch" onPress={handleBlockFriendsChange} value={me?.blockFriendRequests} text="Block other users from adding you as a friend" />
            {/* Not fully implemented
                <SingleSwitch onPress={handleBlockStatsSharingChange} value={me?.blockStatsSharing} text="Block friends from seeing my stats" noBorder />
            */}
            <Divider />
            <View style={tyyli.section}>
                <ChangePassword onPasswordChange={handlePasswordChange} />
            </View>
            <Divider />
            <View style={tyyli.section}>
                <Title>Group</Title>
                    <Text>Group name links you and your friends on stats page at</Text>
                    <Button
                        mode="text"
                        style={{color: 'blue'}}
                        compact
                        uppercase={false}
                        onPress={() => Linking.openURL('https://fudisc.henzi.fi')}
                    >
                        https://fudisc.henzi.fi
                    </Button>
                <TextInput
                    label="Group name"
                    value={groupName}
                    onChangeText={setGroupName}
                    mode="outlined"
                    outlineColor={isSavedGroupName ? 'green' : undefined}
                    dense
                    right={isSavedGroupName && groupName !== '' ? <TextInput.Icon name="check-circle-outline" color="green" /> : undefined}
                />
                <Spacer />
                <Button onPress={handleSetGroup} mode="contained" disabled={isSavedGroupName}>Save</Button>
            </View>
            <Divider />
            <View style={tyyli.section}>
                <Title>Info</Title>
                <InfoText text1="version" text2={appInfo.expo.version} />
                <InfoText text1="build" text2={appInfo.expo.android.versionCode.toString()} />
                {(me?.accountType && me.accountType !== AccountType.PLEB) && (
                    <InfoText text1="account type" text2={me?.accountType ?? 'N/A'} />
                )}
            </View>
            <Divider />
            <View style={tyyli.section}>
                <Title>Delete account</Title>
                <Paragraph>
                    To delete your account, hold down the delete button for five seconds.
                </Paragraph>
                <TouchableRipple onPress={() => null} delayLongPress={4000} onLongPress={confirmDelete} style={tyyli.deleteContainer} >
                    <Text style={tyyli.delete}>Delete</Text>
                </TouchableRipple>
            </View>
        </Container >
    );
};
const InfoText = ({ text1, text2 }: { text1: string, text2: string }) => {
    return (
        <View style={[tyyli.split]}>
            <Text>{text1}</Text>
            <Text style={{ fontWeight: 'bold' }}>{text2}</Text>
        </View>
    );
};
const tyyli = StyleSheet.create({
    deleteContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    section: {
        paddingHorizontal: 13
    },
    delete: {
        width: '90%',
        textAlign: 'center',
        backgroundColor: 'darkred',
        color: 'white',
        fontSize: 18,
        padding: 8,
        marginTop: 10,
        marginBottom: 10,

    },
    split: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    }
});

export default Settings;


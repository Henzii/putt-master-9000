import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Paragraph, Switch, Title, TouchableRipple } from 'react-native-paper';
import Container from '../../components/ThemedComponents/Container';
import Divider from '../../components/ThemedComponents/Divider';
import appInfo from '../../../app.json';
import useMe from '../../hooks/useMe';
import { useMutation } from 'react-apollo';
import { DELETE_ACCOUNT } from '../../graphql/mutation';
import { useNavigate } from 'react-router-native';
import ChangePassword from './ChangePassword';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../reducers/notificationReducer';

const Settings = () => {
    const { me, updateSettings, logout } = useMe();
    const navi = useNavigate();
    const [deleteAccountMutation] = useMutation(DELETE_ACCOUNT);
    const dispatch = useDispatch();
    const handleBlockFriendsChange = () => {
        updateSettings({ blockFriendRequests: !me?.blockFriendRequests });
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
        try {
            await updateSettings({ password: newPassword });
            dispatch(addNotification('Password changed!', 'success'));
        } catch (e) {
            dispatch(addNotification(`Password NOT changed, error: ${(e as Error).message}`, 'alert'));
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
    return (
        <Container>
            <Title>Friends</Title>
            <Paragraph>
                Block other users from adding you as a friend.
            </Paragraph>
            <Pressable onPress={handleBlockFriendsChange} testID='blockFriendRequests'>
                <View style={tyyli.split}>
                    <Text>{me?.blockFriendRequests ? '(ง •̀_•́)ง BLOCK!' : '(っ◕‿◕)っ  (•_• )'}</Text>
                    <Switch
                        testID='blockFriendRequestsSwitch'
                        value={me?.blockFriendRequests}
                        onValueChange={handleBlockFriendsChange}
                    />
                </View>
            </Pressable>
            <Divider />
            <ChangePassword onPasswordChange={handlePasswordChange} />
            <Divider />
            <Title>App info</Title>
            <InfoText text1="version" text2={appInfo.expo.version} />
            <InfoText text1="build" text2={appInfo.expo.android.versionCode.toString()} />
            <Divider />
            <Title>Delete account</Title>
            <Paragraph>
                To delete your account, hold down the delete button for five seconds.
            </Paragraph>
            <TouchableRipple onPress={() => null} delayLongPress={4000} onLongPress={confirmDelete} style={tyyli.deleteContainer} >
                <Text style={tyyli.delete}>Delete</Text>
            </TouchableRipple>
        </Container>
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
    }
});

export default Settings;


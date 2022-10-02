import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Paragraph, Title, TouchableRipple } from 'react-native-paper';
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
import { SingleSwitch } from '../../components/LocalSettings';

const Settings = () => {
    const { me, updateSettings, logout } = useMe();
    const navi = useNavigate();
    const [deleteAccountMutation] = useMutation(DELETE_ACCOUNT);
    const dispatch = useDispatch();

    const handleBlockFriendsChange = () => {
        updateSettings({ blockFriendRequests: !me?.blockFriendRequests });
    };
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
        <Container noPadding withScrollView noFlex>
            <Title style={{ marginTop: 10, marginLeft: 15 }}>Friends</Title>

            <SingleSwitch testID="blockFriendRequestsSwitch" onPress={handleBlockFriendsChange} value={me?.blockFriendRequests} text="Block other users from adding you as a friend" />
            <SingleSwitch onPress={handleBlockStatsSharingChange} value={me?.blockStatsSharing} text="Block friends from seeing my stats" noBorder />
            <Divider />
            <View style={tyyli.section}>
                <ChangePassword onPasswordChange={handlePasswordChange} />
            </View>
            <Divider />
            <View style={tyyli.section}>
                <Title>App info</Title>
                <InfoText text1="version" text2={appInfo.expo.version} />
                <InfoText text1="build" text2={appInfo.expo.android.versionCode.toString()} />
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


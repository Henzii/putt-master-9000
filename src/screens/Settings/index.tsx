import React, { useEffect, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = () => {
    const { me, updateSettings, logout } = useMe();
    const navi = useNavigate();
    const [deleteAccountMutation] = useMutation(DELETE_ACCOUNT);
    const [hideBeers, setHideBeers] = useState<boolean>();
    const dispatch = useDispatch();

    useEffect(() => {
        // Haetaan asyncstoragesta tieto piilotetaanko kaljat
        AsyncStorage.getItem('hideBeers').then(res => {
            if (res === 'false') {
                setHideBeers(false);
            } else if (res === 'true') {
                setHideBeers(true);
            }
        });
    }, []);

    const handleBlockFriendsChange = () => {
        updateSettings({ blockFriendRequests: !me?.blockFriendRequests });
    };
    const handleHideBeersChange = () => {
        const newBooleanString = (!hideBeers).toString();
        AsyncStorage.setItem('hideBeers', newBooleanString).then(() => {
            setHideBeers(!hideBeers);
        }).catch(() => {
            // eslint-disable-next-line no-console
            console.log('Asyncstorage error!');
        });
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
            <View style={tyyli.section}>
                <Title style={{ marginTop: 10 }}>Friends</Title>
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
            </View>
            <Divider />
            <View style={tyyli.section}>
                <Title>Prohibition</Title>
                <View style={tyyli.split}>
                    <Paragraph>
                        Hide beers and bHc
                    </Paragraph>
                    {hideBeers !== undefined && <Switch
                        value={hideBeers}
                        onValueChange={handleHideBeersChange}
                    />}
                </View>
            </View>
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


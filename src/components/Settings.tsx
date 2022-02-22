import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Paragraph, Switch, Title, TouchableRipple } from 'react-native-paper';
import Container from './ThemedComponents/Container';
import Divider from './ThemedComponents/Divider';
import appInfo from '../../app.json';
import useMe from '../hooks/useMe';

const Settings = () => {
    const { me, updateSettings } = useMe();
    const handleBlockFriendsChange = () => {
        updateSettings({ blockFriendRequests: !me?.blockFriendRequests });
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete account?',
            'Deleted account cannot be restored!',
            [
                {
                    text: 'Cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => Alert.alert('Not yet implemented')
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
            <View style={tyyli.split}>
                <Text>Leave me alone</Text>
                <Switch
                    value={me?.blockFriendRequests}
                    onValueChange={handleBlockFriendsChange}
                    />
            </View>
            <Divider />
            <Title>App info</Title>
            <InfoText text1="version" text2={appInfo.expo.version} />
            <InfoText text1="build" text2={appInfo.expo.android.versionCode.toString()} />
            <Divider />
            <Title>Delete account</Title>
            <Paragraph>
                To delete your account, hold down the &apos;delete&apos; button for five seconds.
            </Paragraph>
            <TouchableRipple onPress={() => null} delayLongPress={4000} onLongPress={handleDelete} style={tyyli.deleteContainer} >
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


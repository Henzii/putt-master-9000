import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button, Paragraph, Switch, Title, TouchableRipple } from 'react-native-paper';
import Container from './ThemedComponents/Container';
import Divider from './ThemedComponents/Divider';

const Settings = () => {

    const [blockFriends, setBlockFriends] = useState(false)
    const handleBlockFriendsChange = () => {
        setBlockFriends(!blockFriends)
        Alert.alert('NO!')
    }
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
                    onPress: () => Alert.alert('NO!')
                }
            ]
        )
    }
    return (
        <Container>
            <Title>Password</Title>
            <Paragraph>
                Change password
            </Paragraph>
            <Divider />
            <Title>Friends</Title>
            <Paragraph>
                Block other users from adding you as a friend.
            </Paragraph>
            <View style={tyyli.split}>
                <Text>No more friends</Text>
                <Switch value={blockFriends} onValueChange={handleBlockFriendsChange}/>
            </View>
            <Divider />
            <Title>Delete account</Title>
            <Paragraph>
                To delete your account, hold down the 'delete' button for five seconds.
            </Paragraph>
            <TouchableRipple onPress={() => null} delayLongPress={4000} onLongPress={handleDelete} style={tyyli.deleteContainer} >
                <Text style={tyyli.delete}>Delete</Text>
            </TouchableRipple>
        </Container>
    )
}

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
})

export default Settings;
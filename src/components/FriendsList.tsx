import React, { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Button, Headline, Modal, Portal, Subheading } from 'react-native-paper';
import useMe, { User } from '../hooks/useMe';
import AddFriend from './AddFriend';
import Container from './ThemedComponents/Container';

type FriendListProps = {
    onClick?: (id: number | string, name?: string) => void,
}

const FriendsList = (props: FriendListProps) => {
    const { me } = useMe(true);
    const [addFriendModal, setAddFriendModal] = useState(false);
    const handleKillFriend = () => {
        Alert.alert('Not yet implemented');
    };
    return (
        <Container noPadding>
            <Portal>
                <Modal
                    visible={addFriendModal}
                    onDismiss={() => setAddFriendModal(false)}
                    contentContainerStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <AddFriend onCancel={() => setAddFriendModal(false)} />
                </Modal>
            </Portal>
            <View style={tyyli.buttons}>
                <Button onPress={() => setAddFriendModal(true)}>Add friend</Button>
                <Button onPress={handleKillFriend}>Kill friend</Button>
            </View>
            <Headline style={tyyli.otsikko}>My friends &lt;3</Headline>
            <FlatList
                style={tyyli.lista}
                data={me?.friends}
                renderItem={({ item }) => (
                    <SingleFriend onClick={props.onClick} friend={item} />
                )}
                ItemSeparatorComponent={Separaattori}
            />
        </Container>
    );
};

const SingleFriend = ({ friend, onClick }: { friend: User, onClick?: (id: number | string, name?: string) => void }) => {
    const handleFriendClick = () => {
        if (onClick) onClick(friend.id, friend.name);
    };
    return (
        <Pressable onPress={handleFriendClick}>
            <View style={tyyli.singleFriend}>
                <Subheading>{friend.name}</Subheading>
            </View>
        </Pressable>
    );
};
const Separaattori = () => (<View style={tyyli.separator} />);

const tyyli = StyleSheet.create({
    main: {
        width: '100%',
    },
    singleFriend: {
        padding: 22,
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    separator: {
        minHeight: 1,
        borderTopWidth: 1,
        borderColor: 'lightgray',
    },
    lista: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'lightgray',
        marginTop: 10,
    },
    otsikko: {
        textAlign: 'center',
    }
});
export default FriendsList;
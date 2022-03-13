import { useMutation } from 'react-apollo';
import React, { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from "react-native";
import { Button, Headline, Modal, Portal, Subheading } from 'react-native-paper';
import { REMOVE_FRIEND } from '../graphql/mutation';
import useMe, { User } from '../hooks/useMe';
import AddFriend from './AddFriend';
import ErrorScreen from './ErrorScreen';
import Loading from './Loading';
import Container from './ThemedComponents/Container';
import { GET_ME_WITH_FRIENDS } from '../graphql/queries';

type FriendListProps = {
    onClick?: (id: number | string, name?: string) => void,
}

const FriendsList = (props: FriendListProps) => {
    const { me, loading, error } = useMe(true);
    const [addFriendModal, setAddFriendModal] = useState(false);
    const [removeFriend] = useMutation(REMOVE_FRIEND, { refetchQueries: [{ query: GET_ME_WITH_FRIENDS }] });
    const handleKillFriend = (friendId: string | number, friendName?: string) => {
        Alert.alert(
            'Byebye friend',
            `Friends are replaceable but disc golf is for life!\n\nReally remove ${friendName}?`,
            [
                { text: 'Cancel' },
                {
                    text: 'Do it',
                    onPress: () => removeFriend({ variables: { friendId }})
                }
            ]
        );
    };
    if (loading) {
        return <Loading />;
    }
    if (error) {
        return <ErrorScreen errorMessage={error.message} />;
    }
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
            <Headline style={tyyli.otsikko}>Friends</Headline>
            <FlatList
                style={tyyli.lista}
                data={me?.friends}
                renderItem={({ item }) => (
                    <SingleFriend onClick={props.onClick} onDelete={handleKillFriend} friend={item} />
                )}
                ItemSeparatorComponent={Separaattori}
            />
            <Button onPress={() => setAddFriendModal(true)}>Add friend</Button>
        </Container>
    );
};

const SingleFriend = ({ friend, onClick, onDelete }: { friend: User, onClick?: (id: number | string, name?: string) => void, onDelete?: (id: string, name?: string) => void }) => {
    const handleFriendClick = () => {
        if (onClick) onClick(friend.id, friend.name);
    };
    const handleDelete = () => {
        if (onDelete) onDelete(friend.id as string, friend.name);
    };
    return (
        <Pressable onPress={handleFriendClick}>
            <View style={tyyli.singleFriend}>
                <Subheading>{friend.name}</Subheading>
                <Button onPress={handleDelete}>Remove</Button>
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
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
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
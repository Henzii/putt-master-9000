import { useMutation } from 'react-apollo';
import React, { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from "react-native";
import { Button, Checkbox, Headline, IconButton, Modal, Portal, Subheading } from 'react-native-paper';
import { REMOVE_FRIEND } from '../graphql/mutation';
import useMe, { User } from '../hooks/useMe';
import AddFriend from './AddFriend';
import ErrorScreen from './ErrorScreen';
import Loading from './Loading';
import Container from './ThemedComponents/Container';
import { GET_ME_WITH_FRIENDS } from '../graphql/queries';
import SplitContainer from './ThemedComponents/SplitContainer';

type FriendListProps = {
    onClick?: (friends: Friend[]) => void,
    hideRemoveButton?: boolean,
    multiSelect?: boolean
}
type Friend = {
    id: number | string,
    name: string,
}
const FriendsList = (props: FriendListProps) => {
    const { me, loading, error } = useMe(true);
    const [addFriendModal, setAddFriendModal] = useState(false);
    const [removeFriend] = useMutation(REMOVE_FRIEND, { refetchQueries: [{ query: GET_ME_WITH_FRIENDS }] });
    const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
    const handleFriendClick = (friend: Friend) => {
        if (!selectedFriends.find(f => f.id === friend.id)) {
            setSelectedFriends(selectedFriends.concat(friend));
        } else {
            setSelectedFriends(selectedFriends.filter(f => f.id !== friend.id));
        }
    };
    const handleOkClick = () => {
        if (props.onClick) props.onClick(selectedFriends);
    };
    const handleKillFriend = (friendId: string | number, friendName?: string) => {
        Alert.alert(
            'Byebye friend',
            `Friends are replaceable but disc golf is for life!\n\nReally remove ${friendName}?`,
            [
                { text: 'Cancel' },
                {
                    text: 'Do it',
                    onPress: () => removeFriend({ variables: { friendId } })
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
        <Container noPadding style={{ paddingBottom: 20 }}>
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
                    <SingleFriend
                        onClick={handleFriendClick}
                        onDelete={handleKillFriend}
                        friend={item}
                        selected={selectedFriends.find(f => f.id === item.id) ? true : false}
                        showRemoveButton={!props.hideRemoveButton}
                        showCheckBox={props.multiSelect}
                    />
                )}
                ItemSeparatorComponent={Separaattori}
                ListFooterComponent={Separaattori}
            />
            <SplitContainer spaceAround style={{ marginTop: 20 }}>
            {props.multiSelect && <Button mode="contained" onPress={handleOkClick}>OK</Button>}
            <Button mode="outlined" icon="plus" onPress={() => setAddFriendModal(true)}>Add friend</Button>
            </SplitContainer>
        </Container>
    );
};

type SingleFriendProps = {
    friend: User,
    onClick?: (friend: Friend) => void,
    onDelete?: (id: number | string, name?: string) => void,
    showRemoveButton?: boolean,
    showCheckBox?: boolean,
    selected?: boolean,
}
const SingleFriend = ({ friend, onClick, onDelete, showRemoveButton = true, showCheckBox = false, selected=false}: SingleFriendProps) => {
    const handleFriendClick = () => {
        if (onClick) onClick(friend);
    };
    const handleDelete = () => {
        if (onDelete) onDelete(friend.id as string, friend.name);
    };
    return (
        <Pressable onPress={handleFriendClick}>
            <View style={[tyyli.singleFriend, (selected && tyyli.selectedBackground)]}>
                <View style={tyyli.singleFriendName}>
                    {showCheckBox && <Checkbox status={selected ? 'checked' : 'unchecked'} />}
                    <Subheading>{friend.name}</Subheading>
                </View>
                {showRemoveButton && <IconButton color="rgb(223,50,50)" icon="trash-can" onPress={handleDelete} />}
            </View>
        </Pressable>
    );
};
const Separaattori = () => (<View style={tyyli.separator} />);

const tyyli = StyleSheet.create({
    main: {
        width: '100%',
    },
    selectedBackground: {
        backgroundColor: '#50857250',
    },
    singleFriendName: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    singleFriend: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
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
        borderColor: 'lightgray',
        marginTop: 10,
    },
    otsikko: {
        padding: 10,
        textAlign: 'center',
    }
});
export default FriendsList;
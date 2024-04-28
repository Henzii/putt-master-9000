import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from "react-native";
import { Avatar, Button, Checkbox, IconButton, Modal, Portal, Text, useTheme } from 'react-native-paper';
import { REMOVE_FRIEND } from '../graphql/mutation';
import useMe from '../hooks/useMe';
import AddFriend from './AddFriend';
import ErrorScreen from './ErrorScreen';
import Loading from './Loading';
import Container from './ThemedComponents/Container';
import { GET_ME_WITH_FRIENDS } from '../graphql/queries';
import SplitContainer from './ThemedComponents/SplitContainer';
import { useNavigate } from 'react-router-native';
import { InitialsAndColors, initialsAndColorGenerator } from '../utils/initialsAndColorGenerator';
import { User } from '../types/user';
import { useBackButton } from './BackButtonProvider';


type FriendListProps = {
    onClick?: (friends: Friend[]) => void,
    hideRemoveButton?: boolean,
    multiSelect?: boolean,
    onBackAction?: () => void
}
export type Friend = {
    id: number | string,
    name: string,
}
const FriendsList = (props: FriendListProps) => {
    const { me, loading, error } = useMe(true);
    const [addFriendModal, setAddFriendModal] = useState(false);
    const [removeFriend] = useMutation(REMOVE_FRIEND, { refetchQueries: [{ query: GET_ME_WITH_FRIENDS }] });
    const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
    const navi = useNavigate();
    const backButton = useBackButton();

    useEffect(() => {
        if (props.onBackAction) {
            backButton.setCallBack(props.onBackAction);
            return () => backButton.setCallBack(undefined);
        }
    }, []);

    const handleFriendClick = (friend: Friend) => {
        if (!props.multiSelect) {
            if (props.onClick) {
                props.onClick([friend]);
            }
        }
        else if (!selectedFriends.find(f => f.id === friend.id)) {
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

    const initialsAndColors = initialsAndColorGenerator(me?.friends ?? []);

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
            <SplitContainer spaceAround>
                <Button icon="plus" onPress={() => setAddFriendModal(true)}>Add friend</Button>
                {!props.multiSelect && <Button icon="plus" onPress={() => navi("/signUp/createFriend")}>Create friend</Button>}
            </SplitContainer>
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
                        initialsAndColors={initialsAndColors}
                    />
                )}
            />
            {props.multiSelect && <Button style={tyyli.button} mode="contained" onPress={handleOkClick}>OK</Button>}
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
    initialsAndColors: InitialsAndColors
}
const SingleFriend = ({ friend, onClick, onDelete, showRemoveButton = true, showCheckBox = false, selected = false, initialsAndColors }: SingleFriendProps) => {
    const { colors } = useTheme();
    const handleFriendClick = () => {
        if (onClick) onClick(friend);
    };
    const handleDelete = () => {
        if (onDelete) onDelete(friend.id as string, friend.name);
    };
    const {label: avatarLabel, color: avatarColor} = initialsAndColors[friend.id];
    return (
        <Pressable onPress={handleFriendClick}>
            <View style={[tyyli.singleFriend, { backgroundColor: colors.surface }, (selected && tyyli.selectedBackground)]}>
                <View style={tyyli.singleFriendName}>
                    <Avatar.Text
                        label={avatarLabel}
                        size={40}
                        labelStyle={{fontSize: avatarLabel.length > 1 ? 18 : 20}}
                        style={{backgroundColor: avatarColor}}
                    />
                    {/*<Avatar.Icon icon={selected ? 'account-tie' : 'account'} size={40} style={{backgroundColor: selected ? colors.surface : '#89ab9f'}} />*/}
                    <Text style={tyyli.singleFriendText}>{friend.name}</Text>
                </View>
                {showRemoveButton && <IconButton iconColor="darkred" icon="trash-can-outline" onPress={handleDelete} style={{backgroundColor: colors.background}} />}
                {showCheckBox && <Checkbox status={selected ? 'checked' : 'unchecked'} />}
            </View>
        </Pressable>
    );
};

const tyyli = StyleSheet.create({
    main: {
        width: '100%',
    },
    selectedBackground: {
        backgroundColor: '#89ab9f',
    },
    singleFriendName: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    singleFriendText: {
        fontSize: 18,
        marginLeft: 8,
    },
    singleFriend: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        borderWidth: 1,
        elevation: 5,
        padding: 8,
        marginHorizontal: 10,
        marginVertical: 5,
    },
    button: {
        margin: 10,
    },
    separator: {
        minHeight: 1,
        borderTopWidth: 1,
        borderColor: 'lightgray',
    },
    lista: {
        marginTop: 10,
    },
    otsikko: {
        padding: 10,
        textAlign: 'center',
    }
});
export default FriendsList;
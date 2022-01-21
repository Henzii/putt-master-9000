import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Button, Headline, Subheading } from 'react-native-paper';
import useMe, { User } from '../hooks/useMe';

type FriendListProps = {
    onClick?: (id: number|string) => void,
}

const FriendsList = (props: FriendListProps) => {
    const { me } = useMe();

    return (
        <View style={tyyli.main}>
            <View style={tyyli.buttons}>
                <Button>Add friend</Button>
                <Button>Kill friend</Button>
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
        </View>
    )
}

const SingleFriend = ({ friend, onClick }: { friend: User, onClick?: (id: number|string) => void }) => {
    const handleFriendClick = () => {
        if (onClick) onClick(friend.id);
    }
    return (
        <Pressable onPress={handleFriendClick}>
            <View style={tyyli.singleFriend}>
                <Subheading>{friend.name}</Subheading>
            </View>
        </Pressable>
    )
}
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
})
export default FriendsList;
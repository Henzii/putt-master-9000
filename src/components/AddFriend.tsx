import React, { useState } from 'react';
import { View, StyleSheet } from "react-native";
import { Button, Caption, Headline, Menu, TextInput } from 'react-native-paper';
import { SEARCH_USER } from '../graphql/queries';
import Container from './ThemedComponents/Container';
import useTextInput from '../hooks/useTextInput';
import Loading from './Loading';
import { useLazyQuery } from '@apollo/client';
import { SafeUser } from '../types/user';

type AddFriendProps = {
    onClose?: () => void,
    onAddFriend: (friendName: string) => void,
}

type QueryResponse = {
    searchUser: {
        users: SafeUser[]
    }
}

const AddFriend = ({ onClose, onAddFriend }: AddFriendProps) => {
    const [searchUsers, { data, loading }] = useLazyQuery<QueryResponse>(SEARCH_USER);
    const [dirty, setDirty] = useState(false);
    const searchTextInput = useTextInput({ callBackDelay: 1000, defaultValue: '' }, (value) => {
        if (value !== '') searchUsers({ variables: { search: value.toLowerCase() } });
        setDirty(false);
    });

    const handleAddFriend = () => {
        if (!searchTextInput.value.trim()) {
            return;
        }
        onAddFriend(searchTextInput.value);
        if (onClose) onClose();
    };

    const users = data?.searchUser?.users.slice(0, 5) || undefined;
    return (
        <Container style={tyyli.main} noFlex>
            <Headline>Add friend</Headline>
            <Caption>Who&apos;s your daddy?</Caption>
            <TextInput
                autoComplete='off'
                {...searchTextInput}
                onChangeText={(value) => {
                    searchTextInput.onChangeText(value);
                    setDirty(true);
                }}
                mode='outlined'
                label='Name'
            />
            <View style={tyyli.searchContainer}>
                {
                    dirty || loading ? <Loading noFullScreen loadingText=''/> :
                    users ?
                        users.map(u =>
                            <Menu.Item titleStyle={tyyli.menuItem} title={u.name} key={u.id} onPress={() => {
                                searchTextInput.onChangeText(u.name);
                            }
                            } />) :
                        null
                }
            </View>
            <View style={tyyli.napit}>
                <Button mode='contained' color='green' onPress={handleAddFriend}>Add</Button>
                <Button mode='outlined' onPress={onClose}>Cancel</Button>
            </View>

        </Container>
    );
};

const tyyli = StyleSheet.create({
    searchContainer: {
        backgroundColor: '#00000008',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        elevation: 1,
    },
    menuItem: {
        color: '#888',
    },
    main: {
        width: '90%',
        height: '90%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#fafafa'
    },
    napit: {
        marginTop: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    }
});

export default AddFriend;
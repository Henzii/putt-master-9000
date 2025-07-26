import React, { useState } from 'react';
import { View, StyleSheet } from "react-native";
import { Button, Caption, Headline, Menu, TextInput } from 'react-native-paper';
import { useMutation, useLazyQuery } from '@apollo/client';
import { ADD_FRIEND } from '../graphql/mutation';
import { GET_ME_WITH_FRIENDS, SEARCH_USER } from '../graphql/queries';
import { useDispatch } from 'react-redux';
import { addNotification } from '../reducers/notificationReducer';
import Container from './ThemedComponents/Container';
import useTextInput from '../hooks/useTextInput';
import Loading from './Loading';

type AddFriendProps = {
    onCancel?: () => void,
}

const AddFriend = ({ onCancel }: AddFriendProps) => {
    const [addFriendMutation] = useMutation(ADD_FRIEND, { refetchQueries: [{ query: GET_ME_WITH_FRIENDS }] });
    const [searchUsers, { data, loading }] = useLazyQuery(SEARCH_USER);
    const [dirty, setDirty] = useState(false);
    const dispatch = useDispatch();
    const searchTextInput = useTextInput({ callBackDelay: 1000, defaultValue: '' }, (value) => {
        if (value !== '') searchUsers({ variables: { search: value.toLowerCase() } });
        setDirty(false);
    });
    const handleAdd = async () => {
        const res = await addFriendMutation({ variables: { friendName: searchTextInput.value } });
        if (res.data.addFriend) {
            dispatch(addNotification('Friend added! Nice job little buddy!', 'success'));
            if (onCancel) onCancel();
        } else {
            dispatch(addNotification('Friend not found or request denied', 'alert'));
        }
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
                        users.map((u: { name: string, id: string }) =>
                            <Menu.Item titleStyle={tyyli.menuItem} title={u.name} key={u.id} onPress={() => {
                                searchTextInput.onChangeText(u.name);
                            }
                            } />) :
                        null
                }
            </View>
            <View style={tyyli.napit}>
                <Button mode='contained' color='green' onPress={handleAdd}>Add</Button>
                <Button mode='outlined' onPress={onCancel}>Cancel</Button>
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
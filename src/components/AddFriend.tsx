import React, { useState } from 'react';
import { View, StyleSheet } from "react-native";
import { Button, Caption, Headline, TextInput } from 'react-native-paper';
import { useMutation } from 'react-apollo';
import { ADD_FRIEND } from '../graphql/mutation';
import { GET_ME_WITH_FRIENDS } from '../graphql/queries';
import { useDispatch } from 'react-redux';
import { addNotification } from '../reducers/notificationReducer';

type AddFriendProps = {
    onCancel?: () => void,
}

const AddFriend = ({ onCancel }: AddFriendProps) => {
    const [friendName, setFriendName] = useState('');
    const [addFriendMutation] = useMutation(ADD_FRIEND, { refetchQueries: [{ query: GET_ME_WITH_FRIENDS }] });
    const dispatch = useDispatch();

    const handleAdd = async () => {
            const res = await addFriendMutation({ variables: { friendName } });
        if (res.data.addFriend) {
            dispatch(addNotification('Friend added! Nice job little buddy!', 'success'));
            if (onCancel) onCancel();
        } else {
            dispatch(addNotification('Friend not found or request denied', 'alert'));
            setFriendName('');
        }
    };
    return (
        <View style={tyyli.main}>
            <Headline>Add friend</Headline>
            <Caption>Who&apos;s your daddy?</Caption>
            <TextInput
                autoComplete={false}
                value={friendName}
                onChangeText={(value) => setFriendName(value)}
                mode='outlined'
                label='My new friend'
            />
            <View style={tyyli.napit}>
                <Button mode='contained' color='green' onPress={handleAdd}>Add</Button>
                <Button mode='contained' color='red' onPress={onCancel}>Cancel</Button>
            </View>

        </View>
    );
};

const tyyli = StyleSheet.create({
    main: {
        width: '90%',
        height: '90%',
        backgroundColor: '#fff',
        padding: 20,
    },
    napit: {
        marginTop: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    }
});

export default AddFriend;
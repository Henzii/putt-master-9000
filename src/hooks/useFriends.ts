import { useMutation, useQuery } from "@apollo/client";
import { GET_ME_WITH_FRIENDS } from "../graphql/queries";
import { User } from "../types/user";
import { ADD_FRIEND, REMOVE_FRIEND } from "../graphql/mutation";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { addNotification } from "../reducers/notificationReducer";
import { Alert } from "react-native";

type QueryResponse = {
    getMe: User;
}

export const useFriends = () => {
    const { data, error, loading } = useQuery<QueryResponse>(GET_ME_WITH_FRIENDS, {fetchPolicy: 'cache-and-network'});
    const [removeFriendMutation] = useMutation(REMOVE_FRIEND, { refetchQueries: [{ query: GET_ME_WITH_FRIENDS }] });
    const [addFriendMutation] = useMutation(ADD_FRIEND, { refetchQueries: [{ query: GET_ME_WITH_FRIENDS }] });
    const dispatch = useDispatch();

    const addFriend = useCallback(async (friendName: string) => {
        const res = await addFriendMutation({ variables: { friendName} });
        if (res.data.addFriend) {
            dispatch(addNotification('Friend added! Nice job little buddy!', 'success'));
        } else {
            dispatch(addNotification(`Unable to make friends with ${friendName}. User either blocks friend requests or the request failed for some other reason.`, 'alert'));
        }
    }, [addFriendMutation, dispatch]);

    const removeFriend = useCallback(async (friendId: string | number, friendName?: string) => {
        Alert.alert(
            'Byebye friend',
            `Friends are replaceable but disc golf is for life!\n\nReally remove ${friendName}?`,
            [
                { text: 'Cancel' },
                {
                    text: 'Do it',
                    onPress: () => removeFriendMutation({ variables: { friendId } })
                }
            ]
        );
    }, [removeFriendMutation]);

    return {
        friends: data?.getMe.friends || [],
        removeFriend,
        addFriend,
        loading,
        error,
    };
};

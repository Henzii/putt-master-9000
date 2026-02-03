import { useMutation, useQuery } from "@apollo/client";
import { GET_ME_WITH_FRIENDS } from "../graphql/queries";
import { User } from "../types/user";
import { ADD_FRIEND, REMOVE_FRIEND } from "../graphql/mutation";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { addNotification } from "../reducers/notificationReducer";
import { Alert } from "react-native";
import { useTranslation } from 'react-i18next';

type QueryResponse = {
    getMe: User;
}

export const useFriends = () => {
    const { t } = useTranslation();
    const { data, error, loading } = useQuery<QueryResponse>(GET_ME_WITH_FRIENDS, {fetchPolicy: 'cache-and-network'});
    const [removeFriendMutation] = useMutation(REMOVE_FRIEND, { refetchQueries: [{ query: GET_ME_WITH_FRIENDS }] });
    const [addFriendMutation] = useMutation(ADD_FRIEND, { refetchQueries: [{ query: GET_ME_WITH_FRIENDS }] });
    const dispatch = useDispatch();

    const addFriend = useCallback(async (friendName: string) => {
        const res = await addFriendMutation({ variables: { friendName} });
        if (res.data.addFriend) {
            dispatch(addNotification(t('notifications.friendAdded'), 'success'));
        } else {
            dispatch(addNotification(t('notifications.friendAddFailed', { name: friendName }), 'alert'));
        }
    }, [addFriendMutation, dispatch, t]);

    const removeFriend = useCallback(async (friendId: string | number, friendName?: string) => {
        const handleRemoveFriend = () => {
            try {
                removeFriendMutation({ variables: { friendId } });
                dispatch(addNotification(t('notifications.friendRemoved', { name: friendName || 'friend' }), 'info'));
            } catch (error) {
                dispatch(addNotification(t('notifications.friendRemoveFailed'), 'alert'));
            }
        };
        Alert.alert(
            t('notifications.removeFriendTitle'),
            t('notifications.removeFriendMessage', { name: friendName }),
            [
                { text: t('common.cancel') },
                {
                    text: t('notifications.removeFriendConfirm'),
                    onPress: handleRemoveFriend
                }
            ]
        );
    }, [removeFriendMutation, dispatch, t]);

    return {
        friends: data?.getMe.friends || [],
        removeFriend,
        addFriend,
        loading,
        error,
    };
};

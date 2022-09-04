import { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { LOGIN, UPDATE_MY_SETTINGS } from '../graphql/mutation';
import { GET_ME, GET_ME_WITH_FRIENDS } from '../graphql/queries';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useMe = (getFriends = false) => {

    // Jos getFriend, valitaan query jossa on ystävät mukana
    const query = getFriends ? GET_ME_WITH_FRIENDS : GET_ME;

    const { data, loading, client, error } = useQuery<RawUser>(query, { fetchPolicy: 'cache-and-network' });
    const [loginMutation] = useMutation(LOGIN, { refetchQueries: [{ query: GET_ME }, { query: GET_ME_WITH_FRIENDS }] });
    const [updateSettingsMutation] = useMutation(UPDATE_MY_SETTINGS, {
        // Päivitetään vastaus/uudet asetukset välimuistiin
        update: (cache, result) => {
            const newSettingsResult = result.data.changeSettings;
            const oldCache = cache.readQuery<RawUser>({ query: GET_ME });
            cache.writeQuery({
                query: GET_ME,
                data: {
                    getMe: {
                        ...oldCache?.getMe,
                        ...newSettingsResult,
                    }
                }
            });
        }
    });
    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        if (data?.getMe && !loggedIn) {
            setLoggedIn(true);
        } else if (!data?.getMe && loggedIn && !loading) {
            setLoggedIn(false);
        }
    }, [data]);
    const login = async (username: string, password: string) => {
        const pushToken = await AsyncStorage.getItem('pushToken');
        const result = await loginMutation({ variables: { user: username, password: password, pushToken } });
        const token = result.data.login;
        await AsyncStorage.setItem('token', token);
        setLoggedIn(true);
    };
    const logout = async () => {
        await AsyncStorage.removeItem('token');
        await client.cache.reset();
        await client.clearStore();
        setLoggedIn(false);
    };
    const updateSettings = async (newSettings: (Pick<User, 'blockFriendRequests'> | { password: string }) ) => {
        await updateSettingsMutation({ variables: newSettings });
    };
    return { me: data?.getMe ?? null, logged: loggedIn, login, logout, loading, error, updateSettings };
};


export type User = {
    name: string,
    id: number | string,
    email: string | null,
    friends?: User[],
    blockFriendRequests?: boolean,
}
type RawUser = {
    getMe: User,
}
export default useMe;
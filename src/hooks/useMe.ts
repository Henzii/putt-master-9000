import { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { LOGIN } from '../graphql/mutation';
import { GET_ME, GET_ME_WITH_FRIENDS } from '../graphql/queries';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useMe = (getFriends = false) => {

    // Jos getFriend, valitaan query jossa on ystävät mukana
    const query = getFriends ? GET_ME_WITH_FRIENDS : GET_ME;

    const { data, loading, client, refetch } = useQuery<RawUser>(query, { fetchPolicy: 'cache-and-network' });
    const [loginMutation] = useMutation(LOGIN, { refetchQueries: [{ query: GET_ME }, { query: GET_ME_WITH_FRIENDS }] });
    const [loggedIn, setLoggedIn] = useState(false);
    useEffect( () => {
        if (data?.getMe && !loggedIn) {
            setLoggedIn(true);
        }
    }, [data]);
    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const result = await loginMutation({ variables: { user: username, password: password } });
            const token = result.data.login;
            await AsyncStorage.setItem('token', token);
            refetch();
            setLoggedIn(true);
            return true;
        } catch (e) {
            return false;
        }
    };
    const logout = async () => {
        await AsyncStorage.removeItem('token');
        await client.cache.reset();
        await client.clearStore();
        setLoggedIn(false);
        refetch();
    };
    return { me: data?.getMe ?? null, logged: loggedIn, login, logout, loading };
};


export type User = {
    name: string,
    id: number | string,
    email: string | null,
    friends?: User[]
}
type RawUser = {
    getMe: User,
}
export default useMe;
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { LOGIN, UPDATE_MY_SETTINGS } from '../graphql/mutation';
import { GET_ME, GET_ME_WITH_FRIENDS } from '../graphql/queries';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccountType, UpdatableUserSettings, User } from '../types/user';

type GetMeResponse = { getMe: User }

const useMe = (getFriends = false) => {

    // Jos getFriend, valitaan query jossa on ystävät mukana
    const query = getFriends ? GET_ME_WITH_FRIENDS : GET_ME;

    const { data, loading, client, error, refetch } = useQuery<GetMeResponse>(query, { fetchPolicy: 'cache-and-network' });
    const [loginMutation] = useMutation(LOGIN, {errorPolicy: 'all'});
    const [updateSettingsMutation] = useMutation(UPDATE_MY_SETTINGS, {
        // Päivitetään vastaus/uudet asetukset välimuistiin
        update: (cache, result) => {
            const newSettingsResult = result.data.changeSettings;
            const oldCache = cache.readQuery<GetMeResponse>({ query: GET_ME });
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
        refetch();
        setLoggedIn(true);
    };
    const logout = async () => {
        await AsyncStorage.removeItem('token');
        await client.cache.reset();
        await client.clearStore();
        setLoggedIn(false);
    };
    const updateSettings = async (newSettings: UpdatableUserSettings ) => {
        try {
            await updateSettingsMutation({ variables: newSettings });
        } catch(e) {
            return false;
        }
        return true;
    };
    const isAdmin = () => data?.getMe.accountType === AccountType.ADMIN || data?.getMe.accountType === AccountType.GOD;
    return { me: data?.getMe ?? null, logged: loggedIn, login, logout, loading, error, updateSettings, isAdmin };
};

export default useMe;
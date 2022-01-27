import { useMutation, useQuery } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { LOGIN } from '../graphql/mutation';
import { GET_ME, GET_ME_WITH_FRIENDS } from '../graphql/queries';
import { addNotification } from '../reducers/notificationReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useMe = (getFriends = false) => {
    const { data, loading, error } = useQuery<{ getMe: User }>((getFriends ? GET_ME_WITH_FRIENDS : GET_ME));
    const [loginMutation] = useMutation(LOGIN, { refetchQueries: [{ query: GET_ME }] });
    const dispatch = useDispatch();

    const login = async (username: string, password: string): Promise<boolean> => {
        console.log(username, password)
        try {
            const result = await loginMutation({ variables: { user: username, password: password } })
            const token = result.data.login;
            await AsyncStorage.setItem('token', token);
            dispatch(addNotification('Welcome!'));
            return true;
        } catch (e) {
            dispatch(addNotification('Wrong username or password', "alert"))
            return false;
        }
    }
    return { me: data?.getMe ?? null, logged: (!!data?.getMe), login }
}


export type User = {
    name: string,
    id: number | string,
    email: string | null,
    friends?: User[]
}

export default useMe;
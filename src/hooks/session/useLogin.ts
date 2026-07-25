import { useApolloClient, useMutation } from "@apollo/client";
import { useNotification } from "@hooks/useNotification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-native";
import { LOGIN } from "src/graphql/mutation";
import { setCommonState } from "src/reducers/commonReducer";

export const useLogin = () => {
    const dispatch = useDispatch();
    const [login, { loading }] = useMutation(LOGIN);
    const notify = useNotification();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogin = async (username: string, password: string) => {
        try {
            const response = await login({ variables: { user: username, password } });
            const token = response.data?.login;
            if (token) {
                dispatch(setCommonState({ loginToken: token }));
                await AsyncStorage.setItem('token', token);

                notify(t('components.login.welcomeMessage', { name: username }), 'success');
                navigate('/', { replace: true });
            } else throw new Error();
        } catch {
            notify(t('components.login.wrongCredentials'), 'alert');
        }
    };

    return { login: handleLogin, loading };
};

export const useLogout = () => {
    const dispatch = useDispatch();
    const client = useApolloClient();
    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        dispatch(setCommonState({ loginToken: null }));
        await client.cache.reset();
        await client.clearStore();
    };
    return { logout: handleLogout };
};
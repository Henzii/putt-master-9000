import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../utils/store";
import { useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setCommonState } from "../reducers/commonReducer";
import { useLazyQuery } from "@apollo/client";
import { GET_ME } from "../graphql/queries";
import { User } from "../types/user";
import { setUser } from "../reducers/userReducer";

export enum SESSION_STATE {
    IDLE = 'idle',
    LOADING = 'loading',
    FINISHED = 'finished',
    ERROR = 'error'
}

export const useSession = () => {
    const loginToken = useSelector((state: RootState) => state.common.loginToken);
    const user = useSelector((state: RootState) => state.user);
    const [sessionState, setSessionState] = useState(SESSION_STATE.IDLE);

    const dispatch = useDispatch();
    const [getMe] = useLazyQuery<{getMe: User}>(GET_ME);

    useEffect(() => {
        const getTokenFromStorage = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                dispatch(setCommonState({loginToken: token}));
            } else {
                setSessionState(SESSION_STATE.FINISHED);
            }
        };
        if (!loginToken) {
            setSessionState(SESSION_STATE.LOADING);
            getTokenFromStorage();
        }
    }, []);

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const user = await getMe();
                const {id, name} = user?.data?.getMe ?? {};
                if (!id || !name) {
                    throw new Error();
                } else {
                    dispatch(setUser({id, user: name}));
                    setSessionState(SESSION_STATE.FINISHED);
                }
            } catch {
                setSessionState(SESSION_STATE.ERROR);
            }
        };

        if (loginToken && !user.isLoggedIn) {
            setSessionState(SESSION_STATE.LOADING);
            getAndSetUser();
        } else if (loginToken && user.isLoggedIn) {
            setSessionState(SESSION_STATE.FINISHED);
        }
    }, [loginToken]);

    const clear = () => {
        setSessionState(SESSION_STATE.IDLE);
        dispatch(setCommonState({loginToken: null}));
        dispatch(setUser(null));
        AsyncStorage.clear();
    };

    const hookReturn = useMemo(() => ({
        ...user,
        state: sessionState,
        clear
    }), [user, sessionState]);

    return hookReturn;
};
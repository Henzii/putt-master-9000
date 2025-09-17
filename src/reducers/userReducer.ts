const initialState: UserLoggedOut = {
    isLoggedIn: false
};

export const reducer = (state: UserLoggedIn | UserLoggedOut = initialState, action: UserReducerAction) => {
    switch(action.type) {
        case 'SET_USER': {
            return action.data;
        }
        default:
            return state;
    }
};

export const setUser = (user: UserLoggedIn | null): UserReducerAction => {
    return {
        type: 'SET_USER',
        data: user ?{
            ...user,
            isLoggedIn: true
        } : {isLoggedIn: false}
    };
};

type UserLoggedIn = {
    id: number | string,
    name: string,
    isLoggedIn: true
    groupName?: string
    accountType: string
}

type UserLoggedOut = {
    isLoggedIn: false
}

type UserReducerAction = {
    type: 'SET_USER',
    data: UserLoggedIn | UserLoggedOut
}

export default reducer;
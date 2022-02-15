const reducer = (state: UserData | undefined, action: UserReducerAction) => {
    switch(action.type) {
        case 'SET_USER': {
            return action.data;
        }
        default:
            return state;
    }
};

type UserData = {
    id: number | string,
    user: string,
}
type UserReducerAction = setUserAction
type setUserAction = {
    type: 'SET_USER',
    data: UserData
}
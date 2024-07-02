type CommonState = {
    isUpdateAvailable: boolean
    pushToken: string | null
    loginToken: string | null
};

type CommonAction = {
    type: 'SET_COMMON_STATE'
    payload: Partial<CommonState>
};


const reducer = (state: Partial<CommonState> = {}, action: CommonAction) => {
    switch(action.type) {
        case 'SET_COMMON_STATE':
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
};

export const setCommonState = (newState: Partial<CommonState>) => ({
    type: 'SET_COMMON_STATE',
    payload: newState
});

export default reducer;
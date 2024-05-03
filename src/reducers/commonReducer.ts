type CommonState = {
    isUpdateAvailable?: boolean
};

type CommonAction = {
    type: 'SET'
    payload: Partial<CommonState>
};

const reducer = (state: CommonState = {}, action: CommonAction) => {
    switch(action.type) {
        case 'SET':
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
};

export const setCommonState = (newState: Partial<CommonState>) => ({
    type: 'SET',
    payload: newState
});

export default reducer;
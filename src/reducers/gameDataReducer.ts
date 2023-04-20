

const reducer = (state:gameData | null = null, action: gameDataReducerAction) => {
    switch (action.type) {
        case 'NEW_GAME':
            return { ...action.data };
        case 'UNLOAD_GAME':
            return null;
        case 'NO_SUBSCRIPTION':
            return { ...state, noSubscription: action.data};
        default:
            return state;
    }
};
export const newGame = (newGameId: string, gameOpen=true): newGameAction => {
    return {
        type: 'NEW_GAME',
        data: {
            gameId: newGameId,
            gameOpen: gameOpen,
        }
    };
};
export const unloadGame = (): unloadGameAction => {
    return {
        type: 'UNLOAD_GAME',
    };
};

export const setNoSubscription = (noSubscription = true): noSubscription => ({
    type: 'NO_SUBSCRIPTION',
    data: noSubscription
});

type newGameAction = {
    type: 'NEW_GAME',
    data: gameData
}

type unloadGameAction = {
    type: 'UNLOAD_GAME',
}

type noSubscription = {
    type: 'NO_SUBSCRIPTION',
    data: boolean
}
type gameDataReducerAction = newGameAction | unloadGameAction | noSubscription

export type gameData = {
    gameId: string,
    noSubscription?: boolean,
    gameOpen: boolean | undefined
}
export default reducer;
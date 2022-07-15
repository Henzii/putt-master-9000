const reducer = (state:gameData | null = null, action: gameDataReducerAction) => {
    switch (action.type) {
        case 'NEW_GAME':
            return { ...action.data };
        case 'UNLOAD_GAME':
            return null;
        default:
            return state;
    }
};
export const newGame = (newGameId: string, gameOpen?: boolean): newGameAction => {
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

type newGameAction = {
    type: 'NEW_GAME',
    data: gameData
}
type unloadGameAction = {
    type: 'UNLOAD_GAME',
}
type gameDataReducerAction = newGameAction | unloadGameAction

export type gameData = {
    gameId: string,
    gameOpen: boolean | undefined
}
export default reducer;
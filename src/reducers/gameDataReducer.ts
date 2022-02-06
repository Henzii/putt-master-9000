const reducer = (state:gameData | null = null, action: gameDataReducerAction) => {
    switch (action.type) {
        case 'NEW_GAME':
            return { ...action.data }
        case 'UNLOAD_GAME':
            return null;
        default:
            return state;
    }
}
export const newGame = (newGameId: string): newGameAction => {
    return {
        type: 'NEW_GAME',
        data: {
            gameId: newGameId,
        }
    }
}
export const unloadGame = (): unloadGameAction => {
    return {
        type: 'UNLOAD_GAME',
    }
}

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
}
export default reducer;
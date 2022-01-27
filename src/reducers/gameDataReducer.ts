const reducer = (state:gameData | null = null, action: gameDataReducerAction) => {
    switch (action.type) {
        case 'NEW_GAME':
            return { ...action.data }
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

type newGameAction = {
    type: 'NEW_GAME',
    data: gameData
}
type gameDataReducerAction = newGameAction

export type gameData = {
    gameId: string,
}
export default reducer;
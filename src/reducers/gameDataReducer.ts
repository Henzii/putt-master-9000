const reducer = (state:gameData | null = null, action: gameDataReducerAction) => {
    switch (action.type) {
        case 'NEW_GAME':
            return { ...action.data }
        case 'SET_SCORE':
            if (!state) return state;

            const stateClone = { ...state }
            const player = { ...stateClone.players.find(p => p.id === action.data.id) };
            if (!player?.scores) return state;
            player.scores[action.data.round] = action.data.score;
            return stateClone;
        default:
            return state;
    }
}
export const newGame = (gameData: gameData) => {
    return {
        type: 'NEW_GAME',
        data: gameData,
    }
}
export const setScore = (id: number | string, round: number, score: number): gameDataReducerAction => {
    return {
        type: 'SET_SCORE',
        data: {
            id,
            round,
            score
        }
    }
}
type newGameAction = {
    type: 'NEW_GAME',
    data: gameData
}
type setScoreAction = {
    type: 'SET_SCORE',
    data: {
        id: number | string,
        round: number,
        score: number,
    }
}
type gameDataReducerAction = newGameAction | setScoreAction

export type gameData = {
    holes: number,
    course: string,
    layout: string,
    pars: number[],
    players: gameDataPlayer[],
}
export type gameDataPlayer = {
    name: string,
    scores: number[],
    id: number | string,
}
export default reducer;
const defaultState = {
    holes: 18,
    course: 'Kaljaniitty',
    layout: 'Main',
    pars: [3, 3, 3, 3, 4, 4, 3, 4, 5, 3, 4, 3, 4, 5, 4, 3, 3, 3],
    players: [
        {
            name: 'Henkka',
            scores: [2, 3, 4],
            id: 1,
        },
        {
            name: 'Pekka',
            scores: [3, 3, 4],
            id: 2,
        },
    ]
}

const reducer = (state = defaultState, action: gameDataReducerAction) => {
    switch (action.type) {
        case 'TO_DO':
            return state;
        case 'SET_SCORE':
            const stateClone = { ...state }
            const player = { ...stateClone.players.find(p => p.id === action.data.id) };
            if (!player?.scores) return state;
            player.scores[action.data.round] = action.data.score;
            return stateClone;
        default:
            return state;
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

type gameDataReducerAction = {
    type: 'TO_DO' | 'SET_SCORE',
    data: {
        id: number | string,
        round: number,
        score: number,
    }
}
export type gameData = {
    holes: number,
    course: string,
    layout: string,
    pars: number[],
    players: [gameDataPlayer],
}
export type gameDataPlayer = {
    name: string,
    scores: [number],
    id: number | string,
}
export default reducer;
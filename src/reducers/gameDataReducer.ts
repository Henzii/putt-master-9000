const defaultState = {
    holes: 18,
    course: 'Kaljaniitty',
    layout: 'Main',
    pars: [3, 3, 3, 3, 4, 4, 3, 4, 5, 3, 4, 3, 4, 5, 4, 3, 3, 3],
    players: [
        {
            name: 'Henkka',
            scores: [3, 3, 3],
            id: 1,
        },
        {
            name: 'Pekka',
            scores: [3, 3, 4],
            id: 2,
        },
    ]
}

const reducer = (state = defaultState, action: gameDataReducerActions) => {
    switch (action) {
        case 'TO_DO':
            return state;
    }
    return state;
}

type gameDataReducerActions = 'TO_DO'
export interface gameData {
    holes: number,
    course: string,
    layout: string,
    pars: [ number ],
    players: [ gameDataPlayer ]
}
type gameDataPlayer = {
    name: string,
    scores: [ number ],
    id: number | string,
}
export default reducer;
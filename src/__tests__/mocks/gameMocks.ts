import { GET_GAME } from "../../graphql/queries";
import { Game, Scorecard } from "../../hooks/useGame";
import { ACCOUNT_TYPE } from "../../hooks/useMe";

type MockedGame = Game & {
    __typename: string
    scorecards: (Scorecard & {
        __typename: string
    })[]
}

export const mockedGame: MockedGame = {
    __typename: 'Game',
    id: 'mockedGame1',
    course: "MockedCourse1",
    layout: "MockedLayout1",
    layout_id: "mockedLayout1",
    holes: 5,
    pars: [3,3,3,2,2],
    date: "1.1.2020 09:00",
    startTime: 100,
    endTime: 0,
    par: 13,
    isOpen: true,
    scorecards: [
        {
            __typename: 'Scorecard',
            scores: [3,3,3,3,3],
            beers: 0,
            user: {
                id: 'MockedUserId1',
                name: 'MockerUser1',
                email: '',
                achievements: [],
                accountType: ACCOUNT_TYPE.PLEB,
            },
            hc: 0,
            plusminus: 2,
            total: 15,
        },
    ],
    myScorecard: {
        scores: [3,3,3,3,3],
        beers: 0,
        user: {
            id: 'MockedUserId1',
            name: 'MockerUser1',
            email: '',
            achievements: [],
            accountType: ACCOUNT_TYPE.PLEB
        },
        hc: 0,
        plusminus: 2,
        total: 15
    }
};

export const mockedQuery = {
    request: {
        query: GET_GAME,
        variables: {
            gameId: mockedGame.id,
        },
    },
    result: {
        data: {
            getGame: mockedGame
        }
    }
};
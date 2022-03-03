import { GET_COURSES, GET_GAME, GET_ME_WITH_FRIENDS } from "../graphql/queries";
import { Game } from "../hooks/useGame";
import { User } from "../hooks/useMe";
import { Course, RawCourseData } from "../hooks/useCourses";
export const testiRadat: Course[] = [
    {
        name: 'Testirata1',
        id: 'id1',
        layouts: [
            {
                id: 'id2',
                name: 'Testilayout1',
                par: 27,
                pars: [3, 3, 3, 3, 3, 3, 3, 3, 3],
                holes: 9
            },
            {
                id: 'id5',
                name: 'Testilayout1.2',
                par: 9,
                pars: [4, 3, 2],
                holes: 3
            }
        ]
    },
    {
        name: 'Testirata2',
        id: 'id3',
        layouts: [
            {
                id: 'id4',
                name: 'Testilayout2',
                par: 54,
                pars: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                holes: 18
            }
        ]
    }
];
export const testiMe: User= {
    name: 'Testuser',
    id: 'userid1',
    email: '',
    friends: [
        {
            name: 'TestUser2',
            id: 'userid2',
            email: '',
        },
        {
            name: 'TestUser3',
            id: 'userid3',
            email: '',
        }
    ]
};
export const testiPeli: Game = {
    id: 'g1',
    course: testiRadat[0].name,
    layout: testiRadat[0].layouts[0].name,
    holes: testiRadat[0].layouts[0].holes,
    pars: testiRadat[0].layouts[0].pars,
    par: testiRadat[0].layouts[0].par,
    date: '1.1.2020 13:00',
    isOpen: true,
    myScorecard: {
        scores: [ 2,3,2,3,2,3,2,3,2],
        hc: 0,
        beers: 0,
        user: {
            id: 'u1',
            name: 'testPlayer1',
            email: '',
        }
    },
    scorecards: [
        {
            scores: [ 2,3,2,3,2,3,2,3,2],
            hc: 0,
            beers: 0,
            total: 12,
            plusminus: 30,
            user: {
                id: 'u2',
                name: 'testPlayer1',
                email: '',
            }
        },
        {
            scores: [ 3,2,3,2,3,2,3,2,3],
            hc: 0,
            beers: 0,
            total: 11,
            plusminus: -20,
            user: {
                id: 'u1',
                name: 'testPlayer2',
                email: '',
            }
        }
    ]
};
export const getCoursesMocks = [
    {
        request: {
            query: GET_ME_WITH_FRIENDS,
        },
        result: {
            data: {
                getMe: testiMe
            }
        }
    },
    {
        request: {
            query: GET_GAME,
            variables: {
                gameId: 'g1'
            },
        },
        result: {
            data: {
                getGame: testiPeli
            }
        }
    },
    {
        request: {
            query: GET_COURSES,
            variables: {
                limit: 9,
                offset: 0,
                search: '',
            },
        },
        result: {
            data: {
                getCourses: {
                    hasMore: false,
                    nextOffset: null,
                    courses: testiRadat
                }
            }
        }
    }
];


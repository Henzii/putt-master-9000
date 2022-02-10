import { GET_COURSES } from "../graphql/queries";
export const testiRadat = [
    {
        name: 'Testirata1',
        id: 'id1',
        layouts: [
            {
                id: 'id2',
                name: 'Testilayout1',
                par: 27,
                pars: [3,3,3,3,3,3,3,3,3],
                holes: 9
            },
            {
                id: 'id5',
                name: 'Testilayout1.2',
                par: 9,
                pars: [4,3,2],
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
                pars: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
                holes: 18
            }
        ]
    }
]

export const getCoursesMocks = {
    request: {
        query: GET_COURSES,
        variables: {},
    },
    result: {
        data: {
            getCourses: testiRadat
        }
    }
};

    
import mockedUsers from "./mockedUsers";
import mockedCourses from "./mockedCourses";

export default [
    {
        id: 'mockedGame1',
        course: mockedCourses[0].course,
        layout: mockedCourses[0].layouts[0].name,
        holes: mockedCourses[0].layouts[0].holes,
        pars: mockedCourses[0].layouts[0].pars,
        date: "1.1.2020 09:00",
        startTime: 100,
        endTime: 0,
        par: mockedCourses[0].layouts[0].par,
        isOpen: true,
        scorecards: [
            {
                scores: [3, 3, 3, 3, 3, 3, 3, 3, 3],
                beers: 0,
                user: {
                    id: mockedUsers[0].id,
                    name: mockedUsers[0].name,
                    email: '',
                },
                hc: 0,
                plusminus: 0,
                total: 27,
            },
            {
                scores: [3, 2, 2, 3, 3, 2, 3, 2, 2],
                beers: 0,
                user: {
                    id: mockedUsers[1].id,
                    name: mockedUsers[1].name,
                    email: '',
                },
                hc: 0,
                plusminus: -5,
                total: 22,
            }
        ],
        myScorecard: {
            scores: [3, 2, 2, 3, 3, 2, 3, 2, 2],
            beers: 0,
            user: {
                id: mockedUsers[1].id,
                name: mockedUsers[1].name,
                email: '',
            },
            hc: 0,
            plusminus: -5,
            total: 22,
        }
    }
];
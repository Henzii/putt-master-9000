export default [
    {
        id: 'courseid1',
        name: 'TestCourse1',
        location: {
            coordinates: [64.02,22.22]
        },
        distance: { meters: 69.69, string: '69 meters' },
        layouts: [
            {
                id: 'layoutid1',
                name: 'TestLayout1',
                pars: [3,3,3,3,3,3,3,3,3],
                holes: 9,
                par: 27
            },
            {
                id: 'layoutid2',
                name: 'TestLayout2',
                pars: [3,4,3,3,3,3,3,4,3],
                holes: 9,
                par: 29
            }
        ]
    },
    {
        id: 'courseid2',
        name: 'TestCourse2',
        location: {
            coordinates: [63.02,21.22]
        },
        distance: { meters: 123, string: '123 meters' },
        layouts: [
            {
                id: 'layoutid3',
                name: 'TestLayout3',
                pars: [3,3,3,3,3,3,4,4,3,3,3,3,3,3,3,3,3,3],
                holes: 18,
                par: 56
            },
        ]
    },
];

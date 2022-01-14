import { useState, useEffect } from "react";

const initState:Course[] = [
    {
        name: 'Kaljaniitty',
        id: 1,
        layouts: [
            {
                name: 'Main',
                pars: [3,3,3,3,3,3,3,3,3],
                par: 27,
                holes: 9,
                id: 1
            },
            {
                name: 'Malmari 2x',
                pars: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
                par: 54,
                holes: 18,
                id:2
            }
        ]
    },
    {
        name: 'Siltamäki',
        id: 2,
        layouts: [
            {
                name: 'Main',
                pars:[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2],
                par: 53,
                holes: 18,
                id: 3
            }
        ]
    }
]

const useCourses = () => {
    const [courses, setCourse] = useState<Course[]>();
    useEffect(() => {
        setTimeout(() => {  // Simuloidaan palvelimen viivettä
            console.log('Sim')
            setCourse(initState);
        }, 500)
    }, [])
    return { courses }
}

export type Course = {
    name: string,
    layouts: Layout[]
    id: string | number,
}

export type Layout = {
    name: string,
    pars: number[],
    par: number,
    holes: number,
    id: string | number
}

export default useCourses;
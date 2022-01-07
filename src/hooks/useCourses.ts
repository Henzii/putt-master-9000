import { useState, useEffect } from "react";

const initState:Course[] = [
    {
        name: 'Kaljaniittu',
        layout: 'Main',
        pars: [3,3,3,3,3,3,3,3,3],
        par: 27,
        holes: 9,
        id: 1,
    },
    {
        name: 'Päiväkalja',
        layout: 'Boo',
        pars: [3,3,3,4,3,3,3,3,3,3,4,3,3,3,3,3,3,3],
        par: 56,
        holes: 18,
        id: 2
    }
]

const useCourses = () => {
    const [courses, setCourse] = useState<Course[]>();
    useEffect(() => {
        setTimeout(() => {  // Simuloidaan palvelimen viivettä
            console.log('Sim')
            setCourse(initState);
        }, 1000)
    }, [])
    return { courses }
}

export type Course = {
    name: string,
    layout: string,
    pars: number[],
    par: number,
    holes: number,
    id: string | number,
}

export default useCourses;
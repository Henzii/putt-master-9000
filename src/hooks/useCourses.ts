import { useState, useEffect } from "react";

const useCourses = (courseId?: number | string) => {
    const [courses, setCourse] = useState<Course[]>();
    useEffect(() => {
        setTimeout(() => {  // Simuloidaan palvelimen viivettä
            if (courseId) {
                const course = initState.find(c => c.id === courseId)
                if (course) setCourse([course])
            }
            setCourse(initState);
        }, 500)
    }, [])

    const addLayout = (courseId: number | string, layout: Omit<Layout, "id">) => {
        if (!courses) return;
        setCourse( courses.map(c => {
            if (c.id === courseId) {
                c.layouts.push({...layout, id: Math.floor(Math.random() * 9999 )});
            }
            return c;
        }))
    }
    const getLayoutById = (id: number | string) => {
        if (!courses) return {};
        for(const course of courses) {
            const layout = course.layouts.find(l => l.id === id)
            if (layout) return {layout, course}
        }
        return {};
    }
    return { courses, addLayout, getLayoutById }
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
                id: 2
            },
            {
                name: 'Malmari 2x',
                pars: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
                par: 54,
                holes: 18,
                id:3
            }
        ]
    },
    {
        name: 'Siltamäki',
        id: 4,
        layouts: [
            {
                name: 'Main',
                pars:[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2],
                par: 53,
                holes: 18,
                id: 5
            }
        ]
    }
]

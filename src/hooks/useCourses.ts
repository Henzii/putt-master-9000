import { useState, useEffect } from "react";
import { useQuery, useLazyQuery } from "react-apollo";
import { GET_COURSES } from "../graphql/queries";

const useCourses = (courseId?: number | string) => {
    const { data, loading, error } = useQuery(
        GET_COURSES,
        (courseId) ? { variables: { courseId }} : undefined,
    );
    const addLayout = (courseId: number | string, layout: Omit<Layout, "id">) => {
        return;
    }
    const getLayoutById = (id: number | string) => {
        if (loading || !data || !data.getCourses) return {};
        data.getCourses.find((c:Course) => c.id === id)
    }
    const courses = (!loading && !error && data.getCourses) ? (data.getCourses as Course[]) : undefined;
    return { courses, addLayout, getLayoutById, loading, error: (error !== undefined) }
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

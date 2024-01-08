import type { GPShookReturn } from "./gps";

export type Course = {
    name: string,
    layouts: Layout[]
    id: string | number,
    canEdit?: boolean,
    distance: {
        meters: number,
        string: string,
    }
    location: {
        coordinates: number[]
    },
    gps: GPShookReturn
}

export type Coordinates = {
    lat: number,
    lon: number
}

export type Layout = {
    name: string,
    names?: (string | null)[]
    pars: number[],
    par: number,
    holes: number,
    id: string | number,
    canEdit?: boolean,
    deprecated: boolean
}

export type GetCoursesResponse = {
    getCourses: {
        courses: Course[],
        nextOffset: number,
        hasMore: boolean,
    }
}

export type NewLayout = Pick<Partial<Layout>, "id"> & Omit<Layout, "par" | "id">

import type { GPShookReturn } from "./gps";
import { SafeUser } from "./user";

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

export type TeeSign = {
    index: number
    publicId: string,
    uploadedAt: string,
    uploadedBy: {id: string, name: string};
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
    teeSigns: TeeSign[]
}

export type GetCoursesResponse = {
    getCourses: {
        courses: Course[],
        nextOffset: number,
        hasMore: boolean,
    }
}

export type NewLayout = Pick<Partial<Layout>, "id"> & Omit<Layout, "par" | "id">

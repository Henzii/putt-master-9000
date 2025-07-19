import { Course } from "./course";
import type { User } from "./user";

export type HandShake = {handShake: {latestVersion: number}}
export type GetMe = {getMe: User}

export type GetCourses = {getCourses: {hasMore: boolean, count: number, courses: Course[], nextOffset?: number}}
export type GetCoursesVariables = {
    limit: number,
    offset: number,
    coordinates?: [lon: number, lat: number],
    searchCoordinates?: [lon: number, lat: number],
    maxDistance?: number,
    search?: string
}
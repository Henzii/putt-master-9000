import { DataProxy } from "@apollo/client";
import { FetchResult } from "apollo-boost";
import { GET_COURSES } from "../graphql/queries";
import { Course } from "../hooks/useCourses";

export const newCourseUpdateCache = (cache: DataProxy, result: FetchResult) => {
    // Välimustissa olevat radat...
    const cacheQuery = cache.readQuery<{getCourses:{courses:Course[]}}>({ query: GET_COURSES, variables: { limit: 9, offset: 0 }});
    if (!cacheQuery?.getCourses.courses) return;
    // Muokataan välimuistia niin, että siellä on vain uusi, lisätty rata
    cache.writeQuery({
        query: GET_COURSES, variables: { limit: 9, offset: 0 },
        data: {
            getCourses: {
                __typename: 'GetCoursesResponse',
                hasMore: false,
                nextOffset: 1,
                courses: [
                   {...result.data?.addCourse},
                ]
            }
         }
    });
};

export default { newCourseUpdateCache };
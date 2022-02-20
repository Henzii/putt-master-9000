import { DataProxy } from "@apollo/client";
import { FetchResult } from "apollo-boost";
import { GET_COURSES } from "../graphql/queries";
import { Course } from "../hooks/useCourses";

// Lisää uuden radan (result) välimuistiin
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
                hasMore: false,     /*  hasMore true -> näyttää myös muut radat, uusin ekana  */
                nextOffset: 1,
                courses: [
                   {...result.data?.addCourse},
                ]
            }
         }
    });
};

// Päivittää välimuistissa olevan radan layoutin lisäyksen yhteydessä
export const newLayoutUpdateCache = (cache: DataProxy, result: FetchResult) => {
    const cacheQuery = cache.readQuery<{getCourses:{courses:Course[]}}>({ query: GET_COURSES, variables: { limit: 9, offset: 0 }});
    const modifiedCourse = result?.data?.addLayout;
    cache.writeQuery({
        query: GET_COURSES, variables: { limit: 9, offset: 0},
        data: {
            getCourses: {
                ...cacheQuery?.getCourses,
                courses: cacheQuery?.getCourses.courses.map((c:Course) => (c.id === modifiedCourse.id) ? modifiedCourse : c)
            }
        }
    });
};

export default { newCourseUpdateCache, newLayoutUpdateCache };
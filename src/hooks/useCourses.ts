import { useState } from 'react';
import { useQuery, useMutation } from "react-apollo";

import { ADD_COURSE, ADD_LAYOUT } from "../graphql/mutation";
import { GET_COURSES } from "../graphql/queries";
import { newCourseUpdateCache, newLayoutUpdateCache } from "../utils/courseCacheUpdates";

const useCourses = (search = '') => {
    const [addLayoutMutation] = useMutation(ADD_LAYOUT, { update: newLayoutUpdateCache });
    const [addCourseMutation] = useMutation(ADD_COURSE, { update: newCourseUpdateCache });
    const [searchString, setSearchString] = useState(search);

    const { data, loading, error, fetchMore } = useQuery<RawCourseData>(
        GET_COURSES,
        {
            variables: {
                limit: 9,
                offset: 0,
                search: searchString,
            },
            fetchPolicy: 'cache-and-network'
        }
    );
    const handleFetchMore = () => {
        if (data && data.getCourses.hasMore && !loading && fetchMore) {
            try {
                fetchMore({
                    variables: { limit: 5, offset: data.getCourses.nextOffset },
                    updateQuery: (previous, { fetchMoreResult }) => {
                        if (!fetchMoreResult) return previous;
                        return {
                            getCourses: {
                                ...fetchMoreResult.getCourses,
                                courses: previous.getCourses.courses.concat(fetchMoreResult.getCourses.courses),
                            }
                        };
                    }
                });
            } catch (e) {
                console.error('Error while fetching more courses...');
            }
        }
    };
    const addLayout = async (courseId: number | string, layout: NewLayout) => {
        try {
            await addLayoutMutation({ variables: { courseId, layout } });
        } catch (e) {
            console.log('ERROR', e);
        }
    };
    const addCourse = async (newCourseName: string) => {
        try {
            await addCourseMutation({ variables: { name: newCourseName } });
        } catch (e) {
            console.log('ERROR', e);
        }
    };
    return { courses: data?.getCourses?.courses || undefined, loading, error, addLayout, addCourse, fetchMore: handleFetchMore, setSearchString, searchString };
};
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
export type RawCourseData = {
    getCourses: {
        courses: Course[],
        nextOffset: number,
        hasMore: boolean,
    }
}
export type NewLayout = Omit<Layout, "id" | "par">
export default useCourses;

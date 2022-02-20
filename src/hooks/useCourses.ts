import { useQuery, useMutation } from "react-apollo";

import { ADD_COURSE, ADD_LAYOUT } from "../graphql/mutation";
import { GET_COURSES } from "../graphql/queries";
import { newCourseUpdateCache } from "../utils/courseCacheUpdates";

const useCourses = () => {
    const [addLayoutMutation] = useMutation(ADD_LAYOUT, { refetchQueries: [{ query: GET_COURSES }] });
    const [addCourseMutation] = useMutation(ADD_COURSE, {
        // Päivittää välimuiston radan lisäämisen jälkeen
        update: newCourseUpdateCache,
    });
    const { data, loading, error, fetchMore } = useQuery<RawCourseData>(
        GET_COURSES,
        {
            variables: {
                limit: 9,
                offset: 0
            },
            fetchPolicy: 'cache-and-network'
        }
    );
    const handleFetchMore = () => {
        if (data && data.getCourses.hasMore && !loading) {
            fetchMore({
                variables: { limit: 5, offset: data.getCourses.nextOffset },
                updateQuery: (previous, { fetchMoreResult }) => {
                    console.log(fetchMoreResult?.getCourses.nextOffset);
                    if (!fetchMoreResult) return previous;
                    return {
                        getCourses: {
                            ...fetchMoreResult.getCourses,
                            courses: previous.getCourses.courses.concat(fetchMoreResult.getCourses.courses),
                        }
                    };
                }
            });
        }
    };
    const addLayout = async (courseId: number | string, layout: NewLayout) => {
        try {
            const id = await addLayoutMutation({ variables: { courseId, layout } });
            return id.data.addLayout;
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
    return { courses: data?.getCourses?.courses || undefined, loading, error, addLayout, addCourse, fetchMore: handleFetchMore };
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

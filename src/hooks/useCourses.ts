import { useQuery, useMutation } from "react-apollo";
import { ADD_COURSE, ADD_LAYOUT } from "../graphql/mutation";
import { GET_COURSES } from "../graphql/queries";

const useCourses = (courseId?: number | string) => {
    const { data, loading, error } = useQuery(
        GET_COURSES,
        (courseId) ? { variables: { courseId }} : undefined,
    );
    const [addLayoutMutation] = useMutation(ADD_LAYOUT, { refetchQueries: [{query: GET_COURSES }]});
    const [addCourseMutation] = useMutation(ADD_COURSE, { refetchQueries: [{query: GET_COURSES }]});

    const addLayout = async (courseId: number | string, layout: NewLayout) => {
        try {
            const id = await addLayoutMutation({ variables: { courseId, layout }})
            return id.data.addLayout;
        } catch(e) {
            console.log('ERROR', e)
        }
    }
    const addCourse = async(newCourseName: string) => {
        try {
            const id = await addCourseMutation({ variables: { name: newCourseName }})
            return id.data.addCourse;
        } catch(e) {
            console.log('ERROR', e)
        }
    }
    const courses = (!loading && !error && data.getCourses) ? (data.getCourses as Course[]) : undefined;
    return { courses, addLayout, addCourse, loading, error: (error !== undefined) }
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
export type NewLayout = Omit<Layout, "id" | "par">
export default useCourses;

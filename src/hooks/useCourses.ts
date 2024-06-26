/* eslint-disable no-console */
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useDispatch } from 'react-redux';

import { ADD_COURSE, ADD_LAYOUT } from "../graphql/mutation";
import { GET_COURSES } from "../graphql/queries";
import { addNotification } from '../reducers/notificationReducer';
import useGPS from './useGPS';
import type { Coordinates, GetCoursesResponse, NewLayout } from '../types/course';
import { extractApolloErrorMessage } from '../utils/apollo';

const useCourses = (showDistance = true) => {

    const [searchString, setSearchString] = useState('');
    const [searchLimits, setSearchLimits] = useState<SearchLimits>({
        limit: 9,
        offset: 0,
    });
    const dispatch = useDispatch();
    const gps = useGPS();
    const { data, previousData, loading, error, fetchMore, refetch, variables } = useQuery<GetCoursesResponse>(
        GET_COURSES,
        {
            variables: {
                ...searchLimits,
                search: searchString,
                coordinates: (showDistance && gps.ready) ? [gps.lon, gps.lat] : [0, 0]
            },
            fetchPolicy: 'cache-and-network'
        }
    );
    const [addLayoutMutation, { loading: loadingAddLayout }] = useMutation(ADD_LAYOUT,
        {
            refetchQueries: [ { query: GET_COURSES, variables: variables } ]
    });
    const [addCourseMutation, { loading: loadingAddCourse }] = useMutation(ADD_COURSE);

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
        if (loadingAddLayout) return;
        try {
            await addLayoutMutation({ variables: { courseId, layout } });
            dispatch(addNotification(`Layout ${layout.id ? 'updated' : 'created'}`, 'success'));
        } catch (e) {
            const message = (e as unknown as {message: string}).message.split(': ')[1];
            dispatch(addNotification(message, 'alert'));
        }
    };
    const addCourse = async (newCourseName: string, coordinates: Coordinates, courseId?: string) => {
        if (loadingAddCourse) return;
        try {
            await addCourseMutation({ variables: { name: newCourseName, coordinates, courseId } });
            if (courseId) {
                dispatch(addNotification('Saved', 'success'));
                refetch();
            } else {
                refetch({ limit: 1, offset: 0, search: newCourseName });
            }
        } catch (e) {
            dispatch(addNotification(`Error! ${extractApolloErrorMessage(e)}`, 'alert'));
            console.log('ERROR', e);
        }
    };
    return { courses: data?.getCourses?.courses ?? previousData?.getCourses?.courses ?? undefined,
        error, addLayout, addCourse, fetchMore: handleFetchMore, setSearchString, setSearchLimits,
        searchString, gpsAvailable: gps.ready && showDistance, loading: (loadingAddCourse || loadingAddLayout || loading),
        gps, restricted: !!searchLimits.maxDistance
    };
};

type SearchLimits = {
    limit: number,
    offset: number,
    maxDistance?: number
}
export default useCourses;

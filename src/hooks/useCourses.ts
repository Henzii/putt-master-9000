/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { useQuery, useMutation } from "react-apollo";

import { ADD_COURSE, ADD_LAYOUT } from "../graphql/mutation";
import { GET_COURSES } from "../graphql/queries";
import useGPS from './useGPS';

const useCourses = (showDistance = true) => {

    const [addLayoutMutation] = useMutation(ADD_LAYOUT);
    const [addCourseMutation] = useMutation(ADD_COURSE);
    const [searchString, setSearchString] = useState('');
    const gps = useGPS();
    const { data, loading, error, fetchMore, refetch } = useQuery<RawCourseData>(
        GET_COURSES,
        {
            variables: {
                limit: 9,
                offset: 0,
                search: searchString,
                coordinates: (showDistance && gps.ready) ? [gps.lon, gps.lat] : [0, 0]
            },
            fetchPolicy: 'cache-and-network'
        }
    );
    useEffect(() => {
        // Kun GPS-paikannus on saatu, haetaan data uudestaan gepsi koordinaattien kera
        if (gps.ready && refetch && showDistance) {
            //console.log('Ready', gps.lon, gps.lat);
            refetch({ coordinates: [ gps.lon, gps.lat ]});
        }
    }, [gps.loading]);
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
    const addCourse = async (newCourseName: string, coordinates: Coordinates) => {
        try {
            await addCourseMutation({ variables: { name: newCourseName, coordinates } });
            refetch({ limit: 1, offset: 0, search: newCourseName });
        } catch (e) {
            console.log('ERROR', e);
        }
    };
    return { courses: data?.getCourses?.courses || undefined,
        loading, error, addLayout, addCourse, fetchMore: handleFetchMore, setSearchString, searchString, gpsAvailable: gps.ready && showDistance };
};
export type Course = {
    name: string,
    layouts: Layout[]
    id: string | number,
    distance: {
        meters: number,
        string: string,
    }
}
export type Coordinates = {
    lat: number,
    lon: number
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

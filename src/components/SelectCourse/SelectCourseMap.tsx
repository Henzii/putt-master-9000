import React, { useEffect, useState } from 'react';
import useGPS from "../../hooks/useGPS";
import ErrorScreen from "../ErrorScreen";
import Loading from '../Loading';
import { useLazyQuery } from '@apollo/client';
import { GET_COURSES } from '../../graphql/queries';
import { GetCourses, GetCoursesVariables } from '../../types/queries';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Course, Layout } from '../../types/course';
import SplitContainer from '../ThemedComponents/SplitContainer';
import { Button, SegmentedButtons } from 'react-native-paper';
import { useBackButton } from '../BackButtonProvider';
import CourseDetailsSheet from './CourseDetailsSheet';

type Props = {
    onClose: () => void
    onSelectLayout: (layout: Layout, course: Course) => void
}

const SelectCourseMap = ({ onClose, onSelectLayout }: Props) => {
    const { loading, lon = 0, lat = 0, error, ready } = useGPS();
    const [maxDistance, setMaxDistance] = useState(10_000);
    const [selectedCourseId, setSelectedCourseId] = useState<string | number>();
    const [showSheet, setShowSheet] = useState(false);
    const [fetchCourses, { data, error: queryError }] = useLazyQuery<GetCourses, GetCoursesVariables>(GET_COURSES);
    const backButton = useBackButton();

    useEffect(() => {
        backButton.setCallBack(onClose);
    }, []);

    useEffect(() => {
        if (ready) {
            fetchCourses({
                variables: {
                    limit: 1000,
                    offset: 0,
                    coordinates: [lon, lat],
                    maxDistance
                }
            });
        }
    }, [ready, maxDistance]);

    if (error || queryError) {
        return <ErrorScreen errorMessage={`Failed to load ${error ? 'GPS' : 'courses'}`} />;
    }

    if (loading) {
        return <Loading loadingText='Waiting for GPS' />;
    }

    const courses = data?.getCourses.courses;
    const selectedCourse = courses?.find(course => course.id === selectedCourseId);

    return (
        <View style={styles.container}>
            {selectedCourse && (
                <CourseDetailsSheet
                    open={showSheet}
                    onClose={() => setShowSheet(false)}
                    course={selectedCourse}
                    onSelectLayout={onSelectLayout}
                />
            )}
            <SegmentedButtons
                value={maxDistance.toString()}
                onValueChange={value => setMaxDistance(+value)}
                style={styles.distanceButtons}
                buttons={[
                    {
                        value: "10000",
                        label: '10 km'
                    }, {
                        value: "100000",
                        label: "100 km"
                    }, {
                        value: "1000000",
                        label: "1000 km"
                    }
                ]}
            />
            {selectedCourse && <CourseInfo course={selectedCourse} onSelect={() => setShowSheet(true)} />}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.mapView}
                zoomControlEnabled
                showsUserLocation
                onPress={() => setSelectedCourseId(undefined)}
                initialRegion={{
                    latitude: lat,
                    longitude: lon,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1
                }}
            >
                {courses?.map(course => {
                    const coordinates = {
                        latitude: course.location.coordinates[1],
                        longitude: course.location.coordinates[0]
                    };
                    return (
                        <Marker
                            key={course.id}
                            coordinate={coordinates}
                            onPress={() => setSelectedCourseId(course.id)}
                            onDeselect={() => setSelectedCourseId(undefined)} />
                    );
                })}
            </MapView>
        </View>
    );
};

const CourseInfo = ({ course, onSelect }: { course: Course, onSelect: (name: string) => void }) => {
    return (
        <View style={styles.courseInfo}>
            <SplitContainer>
                <View>
                    <Text style={styles.courseName}>{course.name}</Text>
                    <Text>{course.layouts.length} layouts, {course.distance.string} away</Text>
                </View>
                <Button mode="outlined" onPress={() => onSelect(course.name)}>Select</Button>
            </SplitContainer>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mapView: {
        width: '100%',
        height: '100%',
        zIndex: 1
    },
    courseInfo: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 3,
        backgroundColor: 'white',
        padding: 6,
    },
    courseName: {
        fontSize: 16,
        fontWeight: '600'
    },
    distanceButtons: {
        position: 'absolute',
        backgroundColor: '#ffffffD0',
        top: 10,
        borderRadius: 100,
        left: 10,
        zIndex: 2,
        maxWidth: '80%'
    },
    drawer: {
        position: 'absolute',
        zIndex: 9,
        backgroundColor: 'white',
        width: '90%',
    }
});

export default SelectCourseMap;
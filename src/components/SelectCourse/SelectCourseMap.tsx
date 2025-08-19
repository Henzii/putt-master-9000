import React, { useEffect, useState } from 'react';
import useGPS from "../../hooks/useGPS";
import ErrorScreen from "../ErrorScreen";
import { useLazyQuery } from '@apollo/client';
import { GET_COURSES } from '../../graphql/queries';
import { GetCourses, GetCoursesVariables } from '../../types/queries';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Details, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Course, Layout } from '../../types/course';
import SplitContainer from '../ThemedComponents/SplitContainer';
import { ActivityIndicator, Button } from 'react-native-paper';
import { useBackButton } from '../BackButtonProvider';
import CourseDetailsSheet from './CourseDetailsSheet';
import { useDistanceUnit } from '@hooks/useDistanceUnit';

type Props = {
    onClose: () => void
    onSelectLayout: (layout: Layout, course: Course) => void
}

const SelectCourseMap = ({ onClose, onSelectLayout }: Props) => {
    const { loading, lon = 0, lat = 0, ready } = useGPS();
    const [region, setRegion] = useState<Region>();
    const [selectedCourseId, setSelectedCourseId] = useState<string | number>();
    const [showSheet, setShowSheet] = useState(false);
    const [fetchCourses, { data, previousData, error: queryError }] = useLazyQuery<GetCourses, GetCoursesVariables>(GET_COURSES);
    const backButton = useBackButton();

    useEffect(() => {
        backButton.setCallBack(onClose);
    }, []);

    useEffect(() => {
        if (region) {
            const maxDistance = Math.round(111.32 * (region.latitudeDelta / 2)) * 1000;
            fetchCourses({
                variables: {
                    limit: 1000,
                    offset: 0,
                    coordinates: [lon, lat],
                    searchCoordinates: [region.longitude, region.latitude],
                    maxDistance
                }
            });
        }
    }, [region]);

    useEffect(() => {
        setRegion({
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1
        });
    }, [ready]);

    const handleRegionChange = (region: Region, details: Details) => {
        if (details?.isGesture) {
            setRegion(region);
        }
    };

    if (queryError) {
        return <ErrorScreen errorMessage="Failed to load courses" />;
    }

    const courses = data?.getCourses.courses ?? previousData?.getCourses.courses ?? [];
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
            {selectedCourse && <CourseInfo course={selectedCourse} onSelect={() => setShowSheet(true)} />}
            {loading && <GPSLoading />}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.mapView}
                zoomControlEnabled
                showsUserLocation
                onPress={() => setSelectedCourseId(undefined)}
                onRegionChangeComplete={handleRegionChange}
                region={region}
            >
                {courses.map(course => {
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

const GPSLoading = () => {
    return (
        <View style={styles.gpsLoading}>
            <ActivityIndicator />
            <Text>GPS Loading</Text>
        </View>
    );
};

const CourseInfo = ({ course, onSelect }: { course: Course, onSelect: (name: string) => void }) => {
    const distanceString = useDistanceUnit(course.distance.meters);
    return (
        <View style={styles.courseInfo}>
            <SplitContainer>
                <View>
                    <Text style={styles.courseName}>{course.name}</Text>
                    <Text>{course.layouts.length} layouts, {distanceString} away</Text>
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
    gpsLoading: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 2,
        gap: 8,
        padding: 8
    },
    drawer: {
        position: 'absolute',
        zIndex: 9,
        backgroundColor: 'white',
        width: '90%',
    }
});

export default SelectCourseMap;
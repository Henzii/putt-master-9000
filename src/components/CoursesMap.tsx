import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Button } from 'react-native-paper';
import { Course } from '../hooks/useCourses';
import { GPShookReturn } from '../hooks/useGPS';
import SelectButton from './SelectButton';
import SelectButtonGroup from './SelectButtonGroup';

type CoursesMapProps = {
  courses: Course[],
  gps: GPShookReturn,
  onClose: () => void,
  onDistanceChange: (name: string) => void,
}

const CoursesMap = ({courses, gps, onClose, onDistanceChange}: CoursesMapProps) => {
  if (!gps?.ready || !gps?.lat || !gps?.lon) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topControls}>
        <SelectButtonGroup onSelect={onDistanceChange}>
          <SelectButton name="10">10km</SelectButton>
          <SelectButton name="100">100km</SelectButton>
          <SelectButton name="500">500km</SelectButton>
        </SelectButtonGroup>
      </View>
      <View style={styles.bottomControls}>
          <Button onPress={onClose} mode='contained'>Close</Button>
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: gps.lat,
          longitude: gps.lon,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
        showsUserLocation
      >
        {courses.map(course => (
          <Marker
            key={course.name}
            title={course.name}
            coordinate={{
              latitude: course.location.coordinates[1],
              longitude: course.location.coordinates[0]
            }}
            description={`${course.layouts?.length} layout(s), ${course.distance.string} away`}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        width: '100%',
        height: '100%',
      },
      map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
      topControls: {
        position: 'absolute',
        flexDirection: 'row',
        opacity: 0.8,
        zIndex: 99,
        top: 10,
        left: '20%',
        backgroundColor: '#efefefa0'
      },
      bottomControls: {
        position: 'absolute',
        flexDirection: 'row',
        opacity: 0.8,
        zIndex: 99,
        bottom: 10,
        left: 10,
        backgroundColor: '#efefefa0'
      }
});

export default CoursesMap;

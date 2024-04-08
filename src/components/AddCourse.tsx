import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Button, Caption, Headline, Subheading, Switch, TextInput } from "react-native-paper";
import useGPS from "../hooks/useGPS";
import Loading from "./Loading";
import Divider from "./ThemedComponents/Divider";
import { Coordinates, Course } from "../types/course";
import { GPShookReturn } from "../types/gps";

type AddCourseProps = {
    onCancel?: () => void,
    onAdd?: (name: string, coordinates: Coordinates, courseId?: string) => void,
    loading?: boolean,
    course?: Course
}

const AddCourse = ({ onCancel, onAdd, course, loading=false }: AddCourseProps) => {
    const [newName, setNewName] = useState(course?.name ?? '');
    const [lat, setLat] = useState<string | undefined>(course?.location.coordinates[1].toString());
    const [lon, setLon] = useState<string | undefined>(course?.location.coordinates[0].toString());
    const gps = useGPS();
    useEffect(() => {
        if (gps.ready && !course) {
            setLat(gps.lat?.toString());
            setLon(gps.lon?.toString());
        }
    }, [gps.ready]);
    const handleAddCourse = () => {
        const coords = {
            lat: Number.parseFloat(lat || '0') || 0,
            lon: Number.parseFloat(lon || '0') || 0,
        };
        if (onAdd) onAdd(newName, coords, course?.id.toString());
    };
    return (
        <View style={tyyli.root}>
            <Headline testID="AddCourseTitle">{course ? 'Edit' : 'Add'} Course</Headline>
            <Subheading>Name</Subheading>
            <TextInput value={newName} autoComplete='off' mode="outlined" label="Course name" onChangeText={(value) => setNewName(value)} />
            <Divider />
            {gps.loading
                ? <Loading loadingText="Waiting for GPS..." noFullScreen />
                : <LocationForm
                    latitude={lat}
                    longitude={lon}
                    gps={gps}
                    setLat={setLat}
                    setLon={setLon}
                    manualCoords={!!course}
                />
            }
            {gps.error && <Caption style={{ color: 'red' }}>{gps.error} Set coordinates manually</Caption>}
            <Divider />
            <View style={[tyyli.split, { margin: 20 }]}>
                <Button icon="check" onPress={handleAddCourse} mode="contained" color='green' loading={loading} disabled={loading}>
                    {course ? 'Save' : 'Add'}
                </Button>
                <Button icon="cancel" onPress={onCancel} mode="contained" color='red'>Cancel</Button>
            </View>

        </View>
    );

};
const LocationForm = ({ latitude, longitude, setLat, setLon, gps, manualCoords = false }: {
    latitude?: string, longitude?: string,
    setLat: (v: string) => void, setLon: (v: string) => void,
    gps?: GPShookReturn,
    manualCoords?: boolean
}) => {
    const [manualCoordinates, setManualCoordinates] = useState(manualCoords);

    return (
        <>
            <Subheading>Location</Subheading>
            <View style={[tyyli.split, { justifyContent: 'space-between' }]}>
                <Text>Set coordinates manually</Text>
                <Switch value={manualCoordinates} onChange={() => setManualCoordinates(!manualCoordinates)} />
            </View>
            <View style={tyyli.split}>
                <TextInput
                    value={latitude?.toString()}
                    disabled={!manualCoordinates}
                    autoComplete='off'
                    label="Lat"
                    mode="outlined"
                    style={{ minWidth: 120 }}
                    keyboardType="numeric"
                    onChangeText={setLat}
                />
                <TextInput
                    value={longitude?.toString()}
                    disabled={!manualCoordinates}
                    autoComplete='off'
                    label="Long"
                    mode="outlined"
                    style={{ minWidth: 120 }}
                    keyboardType="numeric"
                    onChangeText={setLon}
                />
            </View>
            {gps && (
                <>
                    <Text style={{ marginTop: 10 }}>GPS accruacy: {Math.floor(gps?.acc || 0)}m</Text>
                    <Text>Current lat: {gps.lat?.toFixed(5)}</Text>
                    <Text>Current lon: {gps.lon?.toFixed(5)}</Text>
                </>
            )}
        </>
    );
};
const tyyli = StyleSheet.create({
    root: {
        width: '90%',
        height: '90%',
        backgroundColor: '#fafafa',
        padding: 20,
    },
    split: {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
    }
});

export default AddCourse;

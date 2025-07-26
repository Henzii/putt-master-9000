import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { ActivityIndicator, Button, Caption, Headline, Subheading, Switch, TextInput } from "react-native-paper";
import useGPS from "../hooks/useGPS";
import Divider from "./ThemedComponents/Divider";
import { Coordinates, Course } from "../types/course";
import { GPShookReturn } from "../types/gps";
import SelectLocationFromMap from "./SelectLocationFromMap";

type AddCourseProps = {
    onCancel?: () => void,
    onAdd?: (name: string, coordinates: Coordinates, courseId?: string) => void,
    loading?: boolean,
    course?: Course
}

const AddCourse = ({ onCancel, onAdd, course, loading = false }: AddCourseProps) => {
    const [newName, setNewName] = useState(course?.name ?? '');
    const [manualCoordinates, setManualCoordinates] = useState(!!course);
    const [displayMap, setDisplayMap] = useState(false);
    const [lat, setLat] = useState<string | undefined>(course?.location.coordinates[1].toString());
    const [lon, setLon] = useState<string | undefined>(course?.location.coordinates[0].toString());
    const gps = useGPS();
    useEffect(() => {
        if (gps.ready && !manualCoordinates) {
            setLat(gps.lat?.toString());
            setLon(gps.lon?.toString());
        }
    }, [gps]);
    const handleAddCourse = () => {
        const coords = {
            lat: Number.parseFloat(lat || '0') || 0,
            lon: Number.parseFloat(lon || '0') || 0,
        };
        if (onAdd) onAdd(newName, coords, course?.id.toString());
    };

    if (displayMap) {
        return (
            <SelectLocationFromMap
                onDismiss={() => setDisplayMap(false)}
                initialRegion={{ latitude: Number(lat) || 0, longitude: Number(lon) || 0, latitudeDelta: 0.5, longitudeDelta: 0.5 }}
                onSelect={((region) => {
                    setLat(region.latitude.toFixed(7));
                    setLon(region.longitude.toFixed(7));
                    setDisplayMap(false);
                })}
            />
        );
    }

    return (
        <View style={tyyli.root}>
            <Headline testID="AddCourseTitle">{course ? 'Edit' : 'Add'} Course</Headline>
            <Subheading>Name</Subheading>
            <TextInput value={newName} autoComplete='off' mode="outlined" label="Course name" onChangeText={(value) => setNewName(value)} />
            <Divider />
            <LocationForm
                latitude={lat}
                longitude={lon}
                gps={gps}
                setLat={setLat}
                setLon={setLon}
                manualCoordinates={manualCoordinates}
                setManualCoordinates={setManualCoordinates}
            />
            {gps.error && <Caption style={{ color: 'red' }}>{gps.error} Set coordinates manually</Caption>}
            <Button disabled={!manualCoordinates} onPress={() => setDisplayMap(true)}>Select location from map</Button>
            <Divider />
            <View style={[tyyli.split, { margin: 20 }]}>
                <Button icon="check" onPress={handleAddCourse} mode="contained" loading={loading} disabled={loading}>
                    {course ? 'Save' : 'Add'}
                </Button>
                <Button icon="cancel" onPress={onCancel} mode="outlined">Cancel</Button>
            </View>
        </View>
    );

};
const LocationForm = ({ latitude, longitude, setLat, setLon, gps, manualCoordinates, setManualCoordinates }: {
    latitude?: string, longitude?: string,
    setLat: (v: string) => void, setLon: (v: string) => void,
    gps?: GPShookReturn,
    manualCoordinates: boolean
    setManualCoordinates: (v: boolean) => void
}) => {
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
            <Text style={{ marginTop: 10 }}>GPS accruacy: {Math.floor(gps?.acc || 0)}m</Text>
            {gps?.loading && (
                <View style={{ flexDirection: 'row', gap: 5 }}>
                    <ActivityIndicator size="small" />
                    <Text>GPS Loading...</Text>
                </View>
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

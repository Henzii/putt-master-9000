import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Button, Caption, Headline, Subheading, Switch, TextInput } from "react-native-paper";
import { Coordinates } from "../hooks/useCourses";
import useGPS from "../hooks/useGPS";
import Loading from "./Loading";
import Divider from "./ThemedComponents/Divider";

const AddCourse = ({ onCancel, onAdd }: AddCourseProps) => {
    const [newName, setNewName] = useState('');
    const [lat, setLat] = useState<string | undefined>();
    const [lon, setLon] = useState<string | undefined>();
    const gps = useGPS();
    useEffect(() => {
        if (gps.ready) {
            setLat(gps.lat?.toString());
            setLon(gps.lon?.toString());
        }
    }, [gps.ready]);
    const handleAddCourse = () => {
        const coords = {
            lat: Number.parseFloat(lat || '0') || 0,
            lon: Number.parseFloat(lon || '0') || 0,
        };
        if (onAdd) onAdd(newName, coords);
    };
    return (
        <View style={tyyli.root}>
            <Headline testID="AddCourseTitle">Add Course</Headline>
            <Subheading>Name</Subheading>
            <TextInput value={newName} autoComplete={false} mode="outlined" label="Course name" onChangeText={(value) => setNewName(value)} />
            <Divider />
            {gps.loading
                ? <Loading loadingText="Waiting for GPS..." noFullScreen />
                : <LocationForm
                    latitude={lat}
                    longitude={lon}
                    accuracy={gps.acc}
                    setLat={setLat}
                    setLon={setLon}
                />
            }
            {gps.error && <Caption style={{ color: 'red' }}>{gps.error} Set coordinates manually</Caption>}
            <Divider />
            <View style={[tyyli.split, { margin: 20 }]}>
                <Button icon="check" onPress={handleAddCourse} mode="contained" color='green'>Add</Button>
                <Button icon="cancel" onPress={onCancel} mode="contained" color='red'>Cancel</Button>
            </View>

        </View>
    );

};
const LocationForm = ({ latitude, longitude, accuracy, setLat, setLon }: {
    latitude?: string, longitude?: string, accuracy?: number | null,
    setLat: (v: string) => void, setLon: (v: string) => void
}) => {
    const [manualCoordinates, setManualCoordinates] = useState(false);

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
                    autoComplete={false}
                    label="Lat"
                    mode="outlined"
                    style={{ minWidth: 120 }}
                    keyboardType="numeric"
                    onChangeText={setLat}
                />
                <TextInput
                    value={longitude?.toString()}
                    disabled={!manualCoordinates}
                    autoComplete={false}
                    label="Long"
                    mode="outlined"
                    style={{ minWidth: 120 }}
                    keyboardType="numeric"
                    onChangeText={setLon}
                />
            </View>
            <Text style={{ marginTop: 10 }}>GPS accruacy: {Math.floor(accuracy || 0)}m</Text>
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
type AddCourseProps = {
    onCancel?: () => void,
    onAdd?: (name: string, coordinates: Coordinates) => void,
}

export default AddCourse;

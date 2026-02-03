import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { ActivityIndicator, Button, Caption, Headline, Subheading, Switch, TextInput } from "react-native-paper";
import { useTranslation } from 'react-i18next';
import { TFunction } from "i18next";
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
    const { t } = useTranslation();
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
            <Headline testID="AddCourseTitle">{course ? t('components.addCourse.editTitle') : t('components.addCourse.addTitle')}</Headline>
            <Subheading>{t('components.addCourse.nameLabel')}</Subheading>
            <TextInput value={newName} autoComplete='off' mode="outlined" label={t('components.addCourse.courseName')} onChangeText={(value) => setNewName(value)} />
            <Divider />
            <LocationForm
                latitude={lat}
                longitude={lon}
                gps={gps}
                setLat={setLat}
                setLon={setLon}
                manualCoordinates={manualCoordinates}
                setManualCoordinates={setManualCoordinates}
                t={t}
            />
            {gps.error && <Caption style={{ color: 'red' }}>{gps.error} {t('components.addCourse.setCoordinatesManuallyHint')}</Caption>}
            <Button disabled={!manualCoordinates} onPress={() => setDisplayMap(true)}>{t('components.addCourse.selectLocationFromMap')}</Button>
            <Divider />
            <View style={[tyyli.split, { margin: 20 }]}>
                <Button icon="check" onPress={handleAddCourse} mode="contained" loading={loading} disabled={loading}>
                    {course ? t('common.save') : t('common.add')}
                </Button>
                <Button icon="cancel" onPress={onCancel} mode="outlined">{t('common.cancel')}</Button>
            </View>
        </View>
    );

};
const LocationForm = ({ latitude, longitude, setLat, setLon, gps, manualCoordinates, setManualCoordinates, t }: {
    latitude?: string, longitude?: string,
    setLat: (v: string) => void, setLon: (v: string) => void,
    gps?: GPShookReturn,
    manualCoordinates: boolean
    setManualCoordinates: (v: boolean) => void
    t: TFunction
}) => {
    return (
        <>
            <Subheading>{t('components.addCourse.locationTitle')}</Subheading>
            <View style={[tyyli.split, { justifyContent: 'space-between' }]}>
                <Text>{t('components.addCourse.setCoordinatesManually')}</Text>
                <Switch value={manualCoordinates} onChange={() => setManualCoordinates(!manualCoordinates)} />
            </View>
            <View style={tyyli.split}>
                <TextInput
                    value={latitude?.toString()}
                    disabled={!manualCoordinates}
                    autoComplete='off'
                    label={t('components.addCourse.latLabel')}
                    mode="outlined"
                    style={{ minWidth: 120 }}
                    keyboardType="numeric"
                    onChangeText={setLat}
                />
                <TextInput
                    value={longitude?.toString()}
                    disabled={!manualCoordinates}
                    autoComplete='off'
                    label={t('components.addCourse.longLabel')}
                    mode="outlined"
                    style={{ minWidth: 120 }}
                    keyboardType="numeric"
                    onChangeText={setLon}
                />
            </View>
            <Text style={{ marginTop: 10 }}>{t('components.addCourse.gpsAccuracy', { value: Math.floor(gps?.acc || 0) })}</Text>
            {gps?.loading && (
                <View style={{ flexDirection: 'row', gap: 5 }}>
                    <ActivityIndicator size="small" />
                    <Text>{t('components.addCourse.gpsLoading')}</Text>
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

import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Text, Switch, TextInput, useTheme } from "react-native-paper";
import { useTranslation } from 'react-i18next';
import { TFunction } from "i18next";
import useGPS from "../hooks/useGPS";
import Divider from "./ThemedComponents/Divider";
import { Coordinates, Course } from "../types/course";
import { GPShookReturn } from "../types/gps";
import SelectLocationFromMap from "./SelectLocationFromMap";
import Button from "./ThemedComponents/Button";
import SplitContainer from "./ThemedComponents/SplitContainer";
import Spacer from "./ThemedComponents/Spacer";

type AddCourseProps = {
    onCancel?: () => void,
    onAdd?: (name: string, coordinates: Coordinates, courseId?: string) => void,
    loading?: boolean,
    course?: Course
}

const AddCourse = ({ onCancel, onAdd, course, loading = false }: AddCourseProps) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
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
        <View style={[styles.root, { backgroundColor: colors.surface }]}>
            <Text variant="headlineMedium" testID="AddCourseTitle">{course ? t('components.addCourse.editTitle') : t('components.addCourse.addTitle')}</Text>
            <Text variant="titleSmall">{t('components.addCourse.nameLabel')}</Text>
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
            <Spacer />
            {gps.error && <Text style={{ color: colors.error }}>{gps.error} {t('components.addCourse.setCoordinatesManuallyHint')}</Text>}
            <Button variant="tertiary" disabled={!manualCoordinates} onPress={() => setDisplayMap(true)}>{t('components.addCourse.selectLocationFromMap')}</Button>
            <Divider />
            <SplitContainer style={{ justifyContent: 'space-evenly', flex: 1 }}>
                <Button icon="check" onPress={handleAddCourse} loading={loading} disabled={loading}>
                    {course ? t('common.save') : t('common.add')}
                </Button>
                <Button icon="cancel" onPress={onCancel} variant="secondary">{t('common.cancel')}</Button>
            </SplitContainer>
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
            <Text>{t('components.addCourse.locationTitle')}</Text>
            <View style={[styles.split, { justifyContent: 'space-between' }]}>
                <Text>{t('components.addCourse.setCoordinatesManually')}</Text>
                <Switch value={manualCoordinates} onChange={() => setManualCoordinates(!manualCoordinates)} />
            </View>
            <View style={styles.split}>
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
const styles = StyleSheet.create({
    root: {
        width: '90%',
        height: '90%',
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

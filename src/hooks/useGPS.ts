import { useState, useEffect } from 'react';
import * as ExpoLocation from 'expo-location';
import { useDispatch } from 'react-redux';
import { addNotification } from '../reducers/notificationReducer';
import { GPShookReturn } from '../types/gps';

const useGPS = (): GPShookReturn => {
    const [currentLocation, setCurrentLocation] = useState<ExpoLocation.LocationObjectCoords | null>(null);
    const [lastKnownLocation, setLastKnownLocation] = useState<ExpoLocation.LocationObjectCoords | null>(null);

    const [error, setError] = useState<string | undefined>();
    const dispatch = useDispatch();
    useEffect(() => {
        const getCurrentLocation = async () => {
            const loc = await ExpoLocation.getCurrentPositionAsync({accuracy: ExpoLocation.Accuracy.High});
            setCurrentLocation(loc.coords);
        };
        const getLastKnownLocation = async () => {
            const loc = await ExpoLocation.getLastKnownPositionAsync({});
            if (loc) {
                setLastKnownLocation(loc.coords);
            }
        };
        const getLocation = async () => {
            try {
                const res = await ExpoLocation.requestForegroundPermissionsAsync();
                if (!res.granted) {
                    setError('Access denied');
                    dispatch(addNotification(`Location failed! Reveived: ${JSON.stringify(res)}`, 'warning'));
                    return;
                }
                getLastKnownLocation();
                getCurrentLocation();
            } catch(e) {
                setError((e as Error).message);
            }
        };
        getLocation();
    }, []);

    const location = currentLocation ?? lastKnownLocation;

    const lat = location?.latitude;
    const lon = location?.longitude;

    return {
        loading: (!currentLocation && !error),
        error,
        ready: Boolean(lat && lon),
        lat,
        lon,
        acc: location?.accuracy ?? lastKnownLocation?.accuracy ?? null
    };

};

export default useGPS;
import { useState, useEffect } from 'react';
import * as ExpoLocation from 'expo-location';
import { useDispatch } from 'react-redux';
import { addNotification } from '../reducers/notificationReducer';
import { GPShookReturn } from '../types/gps';

const useGPS = (): GPShookReturn => {
    const [location, setLocation] = useState<ExpoLocation.LocationObjectCoords | null>(null);
    const [error, setError] = useState<string | undefined>();
    const dispatch = useDispatch();
    useEffect(() => {
        const getLocation = async () => {
            try {
                const res = await ExpoLocation.requestForegroundPermissionsAsync();
                if (!res.granted) {
                    setError('Access denied');
                    dispatch(addNotification(`Location failed! Reveived: ${JSON.stringify(res)}`, 'warning'));
                    return;
                }
                const loc = await ExpoLocation.getCurrentPositionAsync({});
                setLocation(loc.coords);
            } catch(e) {
                setError((e as Error).message);
            }
        };
        getLocation();
    }, []);

    return {
        loading: (!location && !error),
        error,
        ready: (location && location.latitude && location.longitude) ? true : false,
        lat: location?.latitude,
        lon: location?.longitude,
        acc: location?.accuracy || null
    };

};

export default useGPS;
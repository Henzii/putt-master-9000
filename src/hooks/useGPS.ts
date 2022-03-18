import { useState, useEffect } from 'react';
import * as ExpoLocation from 'expo-location';

const useGPS = (): GPShookReturn => {
    const [location, setLocation] = useState<Location | null>(null);
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        const getLocation = async () => {
            try {
                const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setError('Access denied');
                    return;
                }
                const loc = await ExpoLocation.getCurrentPositionAsync({ accuracy: ExpoLocation.LocationAccuracy.Highest, timeInterval: 1000*60 });
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
export type Location = ExpoLocation.LocationObject['coords']
export type GPShookReturn = {
    loading: boolean,
    error?: string,
    lat?: number,
    lon?: number,
    ready: boolean,
    acc: number | null,
}
export default useGPS;
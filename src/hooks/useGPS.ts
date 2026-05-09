import { useState, useEffect, useRef } from "react";
import * as ExpoLocation from "expo-location";
import { useDispatch } from "react-redux";
import { addNotification } from "../reducers/notificationReducer";
import { GPShookReturn } from "../types/gps";

type GPSOptions = {
  distanceInterval?: number;
  updateInterval?: number;
  updateLocation?: boolean
}

/**
 * # useGPS
 * Returns the current GPS location of the device, along with loading and error states.
 * ## options
 * @param updateLocation Whether to actively watch the location or just get the last known location. Default is true (actively watch).
 * @param distanceInterval Minimum change (in meters) in position to trigger an update. Default is 1 meter.
 * @param updateInterval Minimum time (in milliseconds) between updates. Default is 500 ms.
 */
const useGPS = (options?: GPSOptions) : GPShookReturn => {
  const [currentLocation, setCurrentLocation] =
    useState<ExpoLocation.LocationObjectCoords | null>(null);
  const [lastKnownLocation, setLastKnownLocation] =
    useState<ExpoLocation.LocationObjectCoords | null>(null);

  const GPSSubscription = useRef<ExpoLocation.LocationSubscription | null>(
    null
  );

  const [error, setError] = useState<string | undefined>();
  const dispatch = useDispatch();

  useEffect(() => {
    const watchLocation = async () => {
      GPSSubscription.current = await ExpoLocation.watchPositionAsync(
        {
          accuracy: ExpoLocation.Accuracy.High,
          timeInterval: options?.updateInterval ?? 500,
          distanceInterval: options?.distanceInterval ?? 1
        },
        (loc) => {
          setCurrentLocation(loc.coords);
        }
      );
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
          setError("Access denied");
          dispatch(
            addNotification(
              `Location failed! Reveived: ${JSON.stringify(res)}`,
              "warning"
            )
          );
          return;
        }
        getLastKnownLocation();
        watchLocation();
      } catch (e) {
        setError((e as Error).message);
      }
    };
    getLocation();

    return () => {
      GPSSubscription.current?.remove();
    };
  }, []);

  const location = currentLocation ?? lastKnownLocation;

  const lat = location?.latitude;
  const lon = location?.longitude;

  return {
    loading: !currentLocation && !error,
    error,
    ready: Boolean(lat && lon),
    lat,
    lon,
    acc: location?.accuracy ?? lastKnownLocation?.accuracy ?? null,
  };
};

export default useGPS;

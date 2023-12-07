import type * as ExpoLocation from 'expo-location';

export type Location = ExpoLocation.LocationObject['coords']

export type GPShookReturn = {
    loading: boolean,
    error?: string,
    lat?: number,
    lon?: number,
    ready: boolean,
    acc: number | null,
}
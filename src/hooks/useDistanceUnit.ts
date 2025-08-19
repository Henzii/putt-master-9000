import { useSettings } from "@components/LocalSettingsProvider";


export const useDistanceUnit = (meters: number): string => {
    const settings = useSettings();
    const isImperial = settings.getBoolValue('ImperialUnits');

    if (!isImperial) {
        const kilometers = meters / 1000;
        if (kilometers < 10) {
            return `${kilometers.toFixed(1)} km`;
        }
        return `${Math.round(kilometers)} km`;
    }

    const miles = meters / 1609.344;
    if (miles < 10) {
      return `${miles.toFixed(1)} miles`;
    }

    return `${Math.round(miles)} miles`;
};


import { useSettings } from "@components/LocalSettingsProvider";

export const useDistanceUnit = (meters: number): string => {
  const settings = useSettings();
  const isImperial = settings.getBoolValue("ImperialUnits");

  if (!isImperial) {
    if (meters < 1000) {
      return `${meters.toFixed(2)} m`;
    }
    const kilometers = meters / 1000;
    if (kilometers < 10) {
      return `${kilometers.toFixed(1)} km`;
    }
    return `${Math.round(kilometers)} km`;
  }

  const feet = meters * 3.28084;
  if (feet < 5280) {
    // There are 5280 feet in a mile
    return `${feet.toFixed(2)} ft`;
  }

  const miles = meters / 1609.344;
  if (miles < 10) {
    return `${miles.toFixed(1)} miles`;
  }

  return `${Math.round(miles)} miles`;
};

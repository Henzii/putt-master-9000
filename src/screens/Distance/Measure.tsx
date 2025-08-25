import ErrorScreen from "@components/ErrorScreen";
import useGPS from "@hooks/useGPS";
import React, { useState } from "react";
import { FC } from "react";
import { Text, Button } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import Stack from "@components/Stack";
import Spacer from "@components/ThemedComponents/Spacer";
import { getDistanceFromLatLonInMeters } from "src/utils/distance";
import { Point as PointType, MeasuredThrow } from "src/types/throws";
import { useDistanceUnit } from "@hooks/useDistanceUnit";

type Props = {
  onAddMeasuredThrow: (
    measuredThrow: Omit<MeasuredThrow, "createdAt" | "id">
  ) => void;
};

const Measure: FC<Props> = ({ onAddMeasuredThrow }) => {
  const gps = useGPS();
  const [fromLocation, setFromLocation] = useState<PointType>();
  const [toLocation, setToLocation] = useState<PointType>();

  const handleSetLocation = (setter: typeof setFromLocation) => () => {
    const { lat, lon, acc } = gps;
    if (!lat || !lon || !acc) return;

    setter((val) => (val ? undefined : { acc, coordinates: [lat, lon] }));
  };

  const handleAddMeasurement = () => {
    setToLocation(undefined);
    setFromLocation(undefined);

    if (fromLocation && toLocation) {
      onAddMeasuredThrow({
        startingPoint: fromLocation,
        landingPoint: toLocation,
      });
    }
  };

  const [fromLat, fromLon] = fromLocation?.coordinates ?? [
    gps.lat ?? 0,
    gps.lon ?? 0,
  ];
  const [toLat, toLon] = toLocation?.coordinates ?? [
    gps.lat ?? 0,
    gps.lon ?? 0,
  ];

  const distance = getDistanceFromLatLonInMeters([
    fromLat,
    fromLon,
    toLat,
    toLon,
  ]);

  const localizedDistance = useDistanceUnit(distance);

  if (gps.error) {
    return <ErrorScreen errorMessage={"No GPS"} />;
  }

  return (
    <View style={{ flex: 1, padding: 14 }}>
      <Stack direction="column" gap={20}>
        <Stack
          direction="row"
          alignItems="center"
          gap={5}
          justifyContent="space-between"
        >
          <Point point={fromLocation} gps={gps} title="Starting point" />
          <Button
            style={{ flex: 0.2 }}
            onPress={handleSetLocation(setFromLocation)}
            mode={fromLocation ? "outlined" : "contained"}
            icon={fromLocation ? "lock" : "lock-open"}
          >
            {fromLocation ? "Unlock" : "Lock"}
          </Button>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          gap={5}
          justifyContent="space-between"
        >
          <Point point={toLocation} gps={gps} title="Landing point" />
          <Button
            mode={toLocation ? "outlined" : "contained"}
            icon={toLocation ? "lock" : "lock-open"}
            style={{ flex: 0.2 }}
            onPress={handleSetLocation(setToLocation)}
          >
            {toLocation ? "Unlock" : "Lock"}
          </Button>
        </Stack>
        <Spacer />
        <Stack alignItems="center">
          <Text variant="displayMedium">Distance</Text>
          <Text variant="displaySmall">{localizedDistance}</Text>
        </Stack>
        <Spacer />
        <Button
          mode="contained"
          disabled={distance < 10 || !fromLocation || !toLocation}
          onPress={handleAddMeasurement}
        >
          Add to List
        </Button>
      </Stack>
    </View>
  );
};

const Point: FC<{
  point?: PointType;
  gps: ReturnType<typeof useGPS>;
  title: string;
}> = ({ point, gps, title }) => {
  const [lat, lon] = point?.coordinates ?? [gps.lat ?? 0, gps.lon ?? 0];

  const acc = point?.acc ?? gps.acc ?? 0;

  const accStyle =
    acc > 7 ? styles.red : acc > 3 ? styles.orange : styles.green;

  return (
    <Stack>
      <Text variant="titleMedium">{title}</Text>
      <Text>Lat: {lat}</Text>
      <Text>Lon: {lon}</Text>
      <Text style={accStyle}>Acc: {acc?.toFixed(2) || "-"}</Text>
    </Stack>
  );
};

const styles = StyleSheet.create({
  red: {
    color: "red",
  },
  orange: {
    color: "orange",
  },
  green: {
    color: "green",
  },
});

export default Measure;

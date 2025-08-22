import ErrorScreen from "@components/ErrorScreen";
import useGPS from "@hooks/useGPS";
import React, { useState } from "react";
import { FC } from "react";
import { Text, Button } from "react-native-paper";
import { View } from "react-native";
import Stack from "@components/Stack";
import Spacer from "@components/ThemedComponents/Spacer";
import { getDistanceFromLatLonInMeters } from "src/utils/distance";
import { Point as PointType } from "./types";

const Measure: FC = () => {
  const gps = useGPS();
  const [fromLocation, setFromLocation] = useState<PointType>();
  const [toLocation, setToLocation] = useState<PointType>();

  const handleSetLocation = (setter: typeof setFromLocation) => () => {
    const { lat, lon, acc } = gps;
    if (!lat || !lon || !acc) return;

    setter((val) => (val ? undefined : { lat, lon, acc }));
  };

  const handleAddMeasurement = () => {
    setToLocation(undefined);
    setFromLocation(undefined);
  };

  if (gps.error) {
    return <ErrorScreen errorMessage={"No GPS"} />;
  }

  const distance = getDistanceFromLatLonInMeters({
    lat1: fromLocation?.lat ?? gps.lat ?? 0,
    lon1: fromLocation?.lon ?? gps.lon ?? 0,
    lat2: toLocation?.lat ?? gps.lat ?? 0,
    lon2: toLocation?.lon ?? gps.lon ?? 0,
  });

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
            style={{ flex: 0.2 }}
            onPress={handleSetLocation(setToLocation)}
          >
            {toLocation ? "Unlock" : "Lock"}
          </Button>
        </Stack>
        <Spacer />
        <Stack alignItems="center">
          <Text variant="displayMedium">Distance</Text>
          <Text variant="displaySmall">{distance.toFixed(2)} m</Text>
        </Stack>
        <Spacer />
        <Button
          mode="contained"
          disabled={distance < 10}
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
  return (
    <Stack>
      <Text variant="titleMedium">{title}</Text>
      <Text>Lat: {point?.lat ?? gps.lat}</Text>
      <Text>Lon: {point?.lon ?? gps.lon}</Text>
      <Text>Acc: {gps.acc ?? "-"}</Text>
    </Stack>
  );
};

export default Measure;

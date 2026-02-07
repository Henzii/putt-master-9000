import ErrorScreen from "@components/ErrorScreen";
import useGPS from "@hooks/useGPS";
import React from "react";
import { FC } from "react";
import { Text, Button } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import Stack from "@components/Stack";
import Spacer from "@components/ThemedComponents/Spacer";
import { getDistanceFromLatLonInMeters } from "src/utils/distance";
import { Point as PointType, MeasuredThrow } from "src/types/throws";
import { useDistanceUnit } from "@hooks/useDistanceUnit";
import { useMeasurementsStore } from "src/zustand/measurementsStore";
import { useTranslation } from "react-i18next";

type Props = {
  onAddMeasuredThrow: (
    measuredThrow: Omit<MeasuredThrow, "createdAt" | "id">
  ) => void;
};

const Measure: FC<Props> = ({ onAddMeasuredThrow }) => {
  const { t } = useTranslation();
  const gps = useGPS();
  const [fromLocation, toLocation, setFromLocation, setToLocation] =
    useMeasurementsStore((state) => [
      state.startingPoint,
      state.landingPoint,
      state.setStartingPoint,
      state.setLandingPoint,
    ]);

  const handleSetLocation =
    (setter: typeof setFromLocation, clear: boolean) => () => {
      const { lat, lon, acc } = gps;
      if (!lat || !lon || !acc) return;

      if (clear) {
        setter(undefined);
      } else {
        setter({ acc, coordinates: [lat, lon] });
      }
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
          <Point point={fromLocation} gps={gps} title={t('screens.distance.measure.startingPoint')} />
          <Button
            onPress={handleSetLocation(setFromLocation, !!fromLocation)}
            mode={fromLocation ? "outlined" : "contained"}
            icon={fromLocation ? "lock" : "lock-open"}
          >
            {fromLocation ? t('screens.distance.measure.unlock') : t('screens.distance.measure.lock')}
          </Button>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          gap={5}
          justifyContent="space-between"
        >
          <Point point={toLocation} gps={gps} title={t('screens.distance.measure.landingPoint')} />
          <Button
            mode={toLocation ? "outlined" : "contained"}
            icon={toLocation ? "lock" : "lock-open"}
            onPress={handleSetLocation(setToLocation, Boolean(toLocation))}
          >
            {toLocation ? t('screens.distance.measure.unlock') : t('screens.distance.measure.lock')}
          </Button>
        </Stack>
        <Spacer />
        <Stack alignItems="center">
          <Text variant="displayMedium">{t('screens.distance.measure.distance')}</Text>
          <Text variant="displaySmall">{localizedDistance}</Text>
        </Stack>
        <Spacer />
        <Button
          mode="contained"
          disabled={distance < 10 || !fromLocation || !toLocation}
          onPress={handleAddMeasurement}
        >
          {t('screens.distance.measure.addToList')}
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
  const { t } = useTranslation();
  const [lat, lon] = point?.coordinates ?? [gps.lat ?? 0, gps.lon ?? 0];

  const acc = point?.acc ?? gps.acc ?? 0;

  const accStyle =
    acc > 7 ? styles.red : acc > 3 ? styles.orange : styles.green;

  return (
    <Stack style={{ flex: 0 }}>
      <Text variant="titleMedium">{title}</Text>
      <Text>{t('screens.distance.measure.latitude')} {lat}</Text>
      <Text>{t('screens.distance.measure.longitude')} {lon}</Text>
      <Text style={accStyle}>{t('screens.distance.measure.accuracy')} {acc?.toFixed(2) || "-"}</Text>
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

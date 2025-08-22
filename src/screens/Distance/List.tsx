import React from "react";
import Container from "@components/ThemedComponents/Container";
import { FC } from "react";
import { Text } from "react-native-paper";
import { Measurement, SavedMeasurement } from "./types";
import Stack from "@components/Stack";
import { StyleSheet, View } from "react-native";
import { getDistanceFromLatLonInMeters } from "src/utils/distance";
import { stampToDateString } from "src/utils/time";
import Spacer from "@components/ThemedComponents/Spacer";

const points: SavedMeasurement[] = [
  {
    startingPoint: { lat: 60.3093067, lon: 24.978745, acc: 10 },
    landingPoint: { lat: 60.3116867, lon: 24.956085, acc: 10 },
    timestamp: new Date().getTime().toString(),
  },
  {
    startingPoint: { lat: 60.3091067, lon: 24.973745, acc: 10 },
    landingPoint: { lat: 60.3113367, lon: 24.982085, acc: 10 },
    timestamp: new Date().getTime().toString(),
  },
  {
    startingPoint: { lat: 60.3013067, lon: 24.972745, acc: 10 },
    landingPoint: { lat: 60.3156867, lon: 24.951085, acc: 10 },
    timestamp: new Date().getTime().toString(),
  },
];

const List: FC = () => {
  return (
    <Container withScrollView>
      <Text variant="headlineSmall">Saved measurements</Text>
      <Spacer />
      <Stack direction="column" gap={10}>
        {points.map((point, index) => {
          return <Card measurement={point} index={index} key={index} />;
        })}
      </Stack>
    </Container>
  );
};

const Card: FC<{ measurement: SavedMeasurement; index: number }> = ({
  measurement,
  index,
}) => {
  const distance = getDistanceFromLatLonInMeters({
    lat1: measurement.startingPoint.lat,
    lon1: measurement.startingPoint.lon,
    lat2: measurement.landingPoint.lat,
    lon2: measurement.landingPoint.lon,
  });

  return (
    <View style={styles.card}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" gap={10} alignItems="center">
          <Text style={styles.indexText}>{index + 1}.</Text>
          <Text>{stampToDateString(+measurement.timestamp)}</Text>
        </Stack>
        <Text style={styles.distance}>{distance.toFixed(2)} m</Text>
      </Stack>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    elevation: 2,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  indexText: {
    fontWeight: "semibold",
    fontSize: 18,
  },
  distance: {
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default List;

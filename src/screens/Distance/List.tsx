import React from "react";
import Container from "@components/ThemedComponents/Container";
import { FC } from "react";
import { Text } from "react-native-paper";
import Stack from "@components/Stack";
import { StyleSheet, View } from "react-native";
import { getDistanceFromLatLonInMeters } from "src/utils/distance";
import Spacer from "@components/ThemedComponents/Spacer";
import { MeasuredThrow } from "src/types/throws";
import { formattedDate } from "src/utils/dates";

type Props = {
  throws: MeasuredThrow[];
};

const List: FC<Props> = ({ throws }) => {
  return (
    <Container withScrollView>
      <Text variant="headlineSmall">Saved measurements</Text>
      <Spacer />
      <Stack direction="column" gap={10}>
        {throws.map((measurement, index) => {
          return <Card measurement={measurement} index={index} key={index} />;
        })}
      </Stack>
    </Container>
  );
};

const Card: FC<{ measurement: MeasuredThrow; index: number }> = ({
  measurement,
  index,
}) => {
  const coords = [
    ...measurement.startingPoint.coordinates,
    ...measurement.landingPoint.coordinates,
  ];

  const distance = getDistanceFromLatLonInMeters(coords);

  return (
    <View style={styles.card}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" gap={10} alignItems="center">
          <Text style={styles.indexText}>{index + 1}.</Text>
          <Text>{formattedDate(new Date(measurement.createdAt))}</Text>
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

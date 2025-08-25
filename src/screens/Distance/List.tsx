import React from "react";
import Container from "@components/ThemedComponents/Container";
import { FC } from "react";
import { IconButton, Text } from "react-native-paper";
import Stack from "@components/Stack";
import { StyleSheet, View } from "react-native";
import { getDistanceFromLatLonInMeters } from "src/utils/distance";
import Spacer from "@components/ThemedComponents/Spacer";
import { MeasuredThrow } from "src/types/throws";
import { formattedDate } from "src/utils/dates";
import { useDistanceUnit } from "@hooks/useDistanceUnit";

type Props = {
  throws: MeasuredThrow[];
  onDelete: (id: string) => void;
};

const List: FC<Props> = ({ throws, onDelete }) => {
  return (
    <Container withScrollView>
      <Text variant="headlineSmall">Saved measurements</Text>
      <Spacer />
      <Stack direction="column" gap={10}>
        {throws.map((measurement, index) => {
          return (
            <Card
              measurement={measurement}
              index={index}
              key={index}
              onDelete={onDelete}
            />
          );
        })}
      </Stack>
    </Container>
  );
};

const Card: FC<{
  measurement: MeasuredThrow;
  index: number;
  onDelete: (id: string) => void;
}> = ({ measurement, index, onDelete }) => {
  const coords = [
    ...measurement.startingPoint.coordinates,
    ...measurement.landingPoint.coordinates,
  ];

  const distance = getDistanceFromLatLonInMeters(coords);
  const localizedDistance = useDistanceUnit(distance);

  return (
    <View style={styles.card}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" gap={10} alignItems="center">
          <Text style={styles.indexText}>{index + 1}.</Text>
          <Stack>
            <Text style={styles.distance}>{localizedDistance}</Text>
            <Text style={styles.dateText}>
              {formattedDate(new Date(measurement.createdAt))}
            </Text>
          </Stack>
        </Stack>
        <Stack direction="row">
          <IconButton icon="map" />
          <IconButton icon="delete" onPress={() => onDelete(measurement.id)} />
        </Stack>
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
  dateText: {
    fontSize: 12,
  },
});

export default List;

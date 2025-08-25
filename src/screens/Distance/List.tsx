import React, { useState } from "react";
import Container from "@components/ThemedComponents/Container";
import { FC } from "react";
import { IconButton, Text, useTheme } from "react-native-paper";
import Stack from "@components/Stack";
import { StyleSheet, View } from "react-native";
import { getDistanceFromLatLonInMeters } from "src/utils/distance";
import Spacer from "@components/ThemedComponents/Spacer";
import { MeasuredThrow } from "src/types/throws";
import { formattedDate } from "src/utils/dates";
import { useDistanceUnit } from "@hooks/useDistanceUnit";
import MapDisplay from "./MapDisplay";

type Props = {
  throws: MeasuredThrow[];
  onDelete: (id: string) => void;
};

const List: FC<Props> = ({ throws, onDelete }) => {
  const [selectedThrowId, setSelectedThrowId] = useState<MeasuredThrow>();

  if (selectedThrowId) {
    const measuredThrow = throws.find((t) => t.id === selectedThrowId.id);
    if (measuredThrow) {
      return (
        <MapDisplay
          measuredThrow={measuredThrow}
          onClose={() => setSelectedThrowId(undefined)}
        />
      );
    }
  }

  return (
    <Container withScrollView>
      <Text variant="headlineSmall">Saved measurements</Text>
      <Spacer />
      <Stack direction="column" gap={10}>
        {throws.length > 0 ? (
          throws.map((measurement, index) => {
            return (
              <Card
                measurement={measurement}
                index={index}
                key={index}
                onDelete={onDelete}
                onMap={() => setSelectedThrowId(measurement)}
              />
            );
          })
        ) : (
          <Text>No saved measurements</Text>
        )}
      </Stack>
    </Container>
  );
};

const Card: FC<{
  measurement: MeasuredThrow;
  index: number;
  onDelete: (id: string) => void;
  onMap: (id: string) => void;
}> = ({ measurement, index, onDelete, onMap }) => {
  const coords = [
    ...measurement.startingPoint.coordinates,
    ...measurement.landingPoint.coordinates,
  ];

  const distance = getDistanceFromLatLonInMeters(coords);
  const localizedDistance = useDistanceUnit(distance);
  const plusMinus = useDistanceUnit(
    measurement.startingPoint.acc + measurement.landingPoint.acc
  );
  const { colors } = useTheme();

  return (
    <View style={styles.card}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" gap={10} alignItems="center">
          <Text style={styles.indexText}>{index + 1}.</Text>
          <Stack>
            <Stack direction="row" gap={5} alignItems="baseline">
              <Text style={styles.distance}>{localizedDistance}</Text>
              <Text style={styles.plusMinus}>± {plusMinus}</Text>
            </Stack>
            <Text style={styles.dateText}>
              {formattedDate(new Date(measurement.createdAt))}
            </Text>
          </Stack>
        </Stack>
        <Stack direction="row">
          <IconButton
            icon="map"
            iconColor={colors.primary}
            mode="contained"
            onPress={() => onMap(measurement.id)}
          />
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
  plusMinus: {
    fontSize: 12,
    color: "gray",
  },
});

export default List;

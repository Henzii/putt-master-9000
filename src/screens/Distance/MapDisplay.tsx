import React from "react";
import { StyleSheet, View } from "react-native";
import { FC } from "react";
import { MeasuredThrow } from "src/types/throws";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { Button } from "react-native-paper";
import { useBackButton } from "@components/BackButtonProvider";

type Props = {
  measuredThrow: MeasuredThrow;
  onClose: () => void;
};

const MapDisplay: FC<Props> = ({ measuredThrow, onClose }) => {
  useBackButton().setCallBack(onClose);

  return (
    <View style={{ flex: 1 }}>
      <Button
        style={styles.backButton}
        onPress={onClose}
        mode="contained-tonal"
      >
        Back to list view
      </Button>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.mapView}
        zoomControlEnabled
        showsUserLocation
        showsMyLocationButton
        initialRegion={{
          latitude: measuredThrow.startingPoint.coordinates[0],
          longitude: measuredThrow.startingPoint.coordinates[1],
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421,
        }}
      >
        <Polyline
          coordinates={[
            {
              latitude: measuredThrow.startingPoint.coordinates[0],
              longitude: measuredThrow.startingPoint.coordinates[1],
            },
            {
              latitude: measuredThrow.landingPoint.coordinates[0],
              longitude: measuredThrow.landingPoint.coordinates[1],
            },
          ]}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapView: {
    height: "100%",
    width: "100%",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 2,
  },
});

export default MapDisplay;

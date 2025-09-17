import React from 'react';
import { FC } from "react";
import Stack from "./Stack";
import { IconButton, Text } from "react-native-paper";
import { StyleSheet } from 'react-native';

type Props = {
  selectedHole: number
  setSelectedHole: (hole: number) => void
  numberOfHoles: number
}

const HoleSelector: FC<Props> = ({ selectedHole, setSelectedHole, numberOfHoles }) => {

  const handleHoleChange = (hole: number) => {
    if (hole >= numberOfHoles || hole < 0) return;
    setSelectedHole(hole);
  };

  return (
    <Stack direction="row" alignItems='center' justifyContent='space-between' style={styles.contaier}>
      <IconButton
        icon="chevron-left"
        disabled={selectedHole === 0}
        mode="contained"
        onPress={() => handleHoleChange(selectedHole - 1)}
      />
      <Text variant="headlineMedium" style={styles.text}>{selectedHole + 1}</Text>
      <IconButton
        icon="chevron-right"
        mode="contained"
        disabled={selectedHole === numberOfHoles - 1}
        onPress={() => handleHoleChange(selectedHole + 1)}
      />
    </Stack>
  );
};

const styles = StyleSheet.create({
  contaier: {
    padding: 6,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100
  },
  text: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 10,
    borderRadius: 100,
  }
});

export default HoleSelector;
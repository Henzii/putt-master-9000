import React from 'react';
import { FC } from "react";
import Stack from "./Stack";
import { IconButton, Text } from "react-native-paper";

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
    <Stack direction="row" alignItems='center' justifyContent='space-between' style={{padding: 5}}>
      <IconButton
        icon="chevron-left"
        disabled={selectedHole === 0}
        mode="contained"
        onPress={() => handleHoleChange(selectedHole - 1)}
      />
      <Text variant="headlineMedium">{selectedHole + 1}</Text>
      <IconButton
        icon="chevron-right"
        mode="contained"
        disabled={selectedHole === numberOfHoles - 1}
        onPress={() => handleHoleChange(selectedHole + 1)}
      />
    </Stack>
  );
};

export default HoleSelector;
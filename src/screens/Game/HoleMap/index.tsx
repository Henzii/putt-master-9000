import React from 'react';
import type { FC } from "react";
import { View } from "react-native";
import { useGameStore } from 'src/zustand/gameStore';
import HoleSelector from '@components/HoleSelector';
import useGame from '@hooks/useGame';
import NoImage from './NoImage';
import TeeSignImage from './TeeSignImage';
import { useHoleMapUpload } from '@hooks/useHoleMapUpload';

const HoleMap: FC = () => {
  const gameId = useGameStore(state => state.gameId);
  const { layout } = useGame(gameId ?? '');
  const uploadImage = useHoleMapUpload();
  const [selectedRound, setSelectedRound] = useGameStore(state => [state.selectedRound, state.setSelectedRound]);

  if (!layout) {
    return null;
  }

  const publicId = layout.teeSigns.find(hole => hole.index === selectedRound)?.publicId;

  return (
    <View style={{ flex: 1 }}>
      <HoleSelector selectedHole={selectedRound} setSelectedHole={setSelectedRound} numberOfHoles={18} />
      {publicId ? (
        <TeeSignImage publidId={publicId} />
      ) : (
        <NoImage onImageUpload={uploadImage} />
      )}
    </View>
  );
};


export default HoleMap;
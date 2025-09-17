import React from 'react';
import type { FC } from "react";
import { View } from "react-native";
import { useGameStore } from 'src/zustand/gameStore';
import HoleSelector from '@components/HoleSelector';
import useGame from '@hooks/useGame';
import NoImage from './NoImage';
import TeeSignImage from './TeeSignImage';
import { useHoleMapUpload } from '@hooks/useHoleMapUpload';
import Loading from '@components/Loading';
import { useTranslation } from 'react-i18next';

const HoleMap: FC = () => {
  const gameId = useGameStore(state => state.gameId);
  const { layout } = useGame(gameId ?? '');
  const {t} = useTranslation();
  const {uploadImage, uploading} = useHoleMapUpload();
  const [selectedRound, setSelectedRound] = useGameStore(state => [state.selectedRound, state.setSelectedRound]);

  if (!layout) {
    return null;
  }

  const teeSign = layout.teeSigns.find(hole => hole.index === selectedRound);

  if (uploading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Loading loadingText={t('screens.game.holeMap.imageUploading')} /></View>;
  }

  return (
    <View style={{ flex: 1 }}>
      <HoleSelector selectedHole={selectedRound} setSelectedHole={setSelectedRound} numberOfHoles={18} />
      {teeSign ? (
        <TeeSignImage teeSign={teeSign} onImageUpload={layout.canEdit ? uploadImage : undefined} />
      ) : (
        <NoImage onImageUpload={uploadImage} />
      )}
    </View>
  );
};


export default HoleMap;
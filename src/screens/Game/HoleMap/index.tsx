import React from 'react';
import type { FC } from "react";
import { Image, StyleSheet, View, Dimensions } from "react-native";
import { Button, Text } from 'react-native-paper';
import { useGameStore } from 'src/zustand/gameStore';
import { useTranslation } from 'react-i18next';
import Spacer from '@components/ThemedComponents/Spacer';
import HoleSelector from '@components/HoleSelector';
import TakePhoto from './TakePhoto';

const HoleMap: FC = () => {
    const {t} = useTranslation();

    const [selectedRound, setSelectedRound] = useGameStore(state => [state.selectedRound, state.setSelectedRound]);
/*

    const handlePickImage = async () => {
        const result = await ExpoImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'livePhotos'],
            allowsEditing: true,
            quality: 1,
        });
    };
*/
    return (
      <View style={{ flex: 1 }}>
        <HoleSelector selectedHole={selectedRound} setSelectedHole={setSelectedRound} numberOfHoles={18} />
        <View style={styles.textContainer}>
          <Text variant="headlineSmall">
            {t("screens.game.holeMap.noImageTitle")}
          </Text>
          <Text>{t("screens.game.holeMap.noImageText")}</Text>
        </View>
        <Spacer size={30} />
        <Image
          source={require("assets/tee-sign.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Spacer size={30} />
        <View style={styles.buttons}>
          <TakePhoto />
          <Button mode="contained-tonal" onPress={() => null}>
            {t("screens.game.holeMap.uploadFromGallery")}
          </Button>
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
  image: {
    width: Dimensions.get('window').width,
    aspectRatio: 1.5,
    height: undefined
  },
  textContainer: {
    padding: 10,
  },
  buttons: {
    padding: 20,
    gap: 8
  }
});

export default HoleMap;
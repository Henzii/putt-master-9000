import React from 'react';
import type { FC } from "react";
import { Image, StyleSheet, View, Dimensions } from "react-native";
import { Button, Text } from 'react-native-paper';
import * as ExpoImagePicker from 'expo-image-picker';
import { useGameStore } from 'src/zustand/gameStore';
import { useHoleMapUpload } from '@hooks/useHoleMapUpload';
import { useTranslation } from 'react-i18next';
import Container from '@components/ThemedComponents/Container';
import Spacer from '@components/ThemedComponents/Spacer';
import HoleSelector from '@components/HoleSelector';

const HoleMap: FC = () => {
    const {t} = useTranslation();

    const [selectedRound, setSelectedRound] = useGameStore(state => [state.selectedRound, state.setSelectedRound]);
    const uploadImage = useHoleMapUpload();

    const handlePickImage = async () => {
        const result = await ExpoImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'livePhotos'],
            allowsEditing: true,
            quality: 1,
        });
    };

    const handleTakePhoto = async () => {
        const { status: cameraStatus } = await ExpoImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus !== 'granted') {
            console.error('Camera permission not granted');
            return;
        }
        const result = await ExpoImagePicker.launchCameraAsync({
            mediaTypes: ['images', 'livePhotos'],
            allowsEditing: true,
            quality: 1,
        });

        uploadImage();
    };

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
          <Button mode="contained" onPress={handleTakePhoto}>
            {t("screens.game.holeMap.takePhoto")}
          </Button>
          <Button mode="contained-tonal" onPress={handlePickImage}>
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
import React from 'react';
import type { FC } from "react";
import { View } from "react-native";
import { Button, Text } from 'react-native-paper';
import * as ExpoImagePicker from 'expo-image-picker';
import { useGameStore } from 'src/zustand/gameStore';
import { useHoleMapUpload } from '@hooks/useHoleMapUpload';

const HoleMap: FC = () => {

    const selectedRound = useGameStore(state => state.selectedRound);
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
        <View>
            <Text variant="headlineSmall">
                Kuva {selectedRound}
            </Text>
            <Button mode="contained" onPress={handleTakePhoto}>
                Press me
            </Button>
        </View>
    );
};

export default HoleMap;
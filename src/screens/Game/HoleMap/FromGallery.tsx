import React, { type FC } from "react";
import * as ExpoImagePicker from 'expo-image-picker';
import { Button } from "react-native-paper";
import { useTranslation } from "react-i18next";

type Props = {
    onImageUpload: (uri: string) => void
}

const FromGallery: FC<Props> = ({onImageUpload}) => {
    const {t} = useTranslation();
    const handlePickImage = async () => {
        const result = await ExpoImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'livePhotos'],
            allowsEditing: true,
            quality: 1,
        });

        const imageUri = result.assets?.[0]?.uri;
        if (!imageUri) {
            return;
        }

        onImageUpload(imageUri);
    };

    return (
        <Button mode="contained-tonal" onPress={handlePickImage}>
            {t("screens.game.holeMap.uploadFromGallery")}
        </Button>
    );
};

export default FromGallery;
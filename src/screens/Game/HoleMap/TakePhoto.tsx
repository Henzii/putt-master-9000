import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import * as ExpoImagePicker from 'expo-image-picker';
import { useHoleMapUpload } from '@hooks/useHoleMapUpload';
import { useDispatch } from 'react-redux';
import { addNotification } from 'src/reducers/notificationReducer';

const TakePhoto: React.FC = () => {
    const {t} = useTranslation();
    const uploadImage = useHoleMapUpload();
    const dispatch = useDispatch();

    const handleTakePhoto = async () => {
        const { status: cameraStatus } = await ExpoImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus !== 'granted') {
            dispatch(addNotification(t('errors.noCameraPermission'), 'alert'));
            return;
        }

        const result = await ExpoImagePicker.launchCameraAsync({
            mediaTypes: ['images', 'livePhotos'],
            allowsEditing: true,
            quality: 1,
        });

        const imageUri = result.assets?.[0]?.uri;
        if (!imageUri) {
            return;
        }

        uploadImage(imageUri);
    };
    return (
        <Button mode="contained" onPress={handleTakePhoto}>
            {t("screens.game.holeMap.takePhoto")}
        </Button>
    );
};

export default TakePhoto;
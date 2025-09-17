import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import React, { type FC } from "react";
import { Image, StyleSheet, View } from "react-native";
import TakePhoto from "./TakePhoto";
import FromGallery from "./FromGallery";
import { TeeSign } from "src/types/course";
import ErrorScreen from "@components/ErrorScreen";
import { useTranslation } from "react-i18next";

type Props = {
    teeSign: TeeSign
    onImageUpload?: (uri: string) => void
}

const CLOUD_NAME = 'dz4rbnmyw';

const TeeSignImage: FC<Props> = ({ teeSign, onImageUpload }) => {
    const {publicId, uploadedAt} = teeSign;
    const [isError, setIsError] = React.useState(false);
    const {t} = useTranslation();

    const imageUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/fudisc-tee-signs/${publicId}?t=${uploadedAt}`;

    if (isError) {
        return (
                <ErrorScreen errorMessage={t('screens.game.holeMap.failedToLoad')} showBackToFrontpage={false} />
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <ReactNativeZoomableView
                minZoom={1}
                maxZoom={8}
            >
            <Image
                source={{uri: imageUrl}}
                key={uploadedAt}
                onError={() => setIsError(true)}
                style= {{
                    width: "100%",
                    height: "100%",
                    resizeMode: 'contain',
                }}
                />
            </ReactNativeZoomableView>
            {onImageUpload && (
                <View style={styles.buttons}>
                    <TakePhoto onImageUpload={onImageUpload} iconOnly />
                    <FromGallery onImageUpload={onImageUpload} iconOnly />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    buttons: {
        position: 'absolute',
        flexDirection: 'row',
        bottom: 0,
        padding: 10,
        gap: 4
    }
});

export default TeeSignImage;
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import React, { useState, type FC } from "react";
import { Image, StyleSheet, View } from "react-native";
import TakePhoto from "./TakePhoto";
import FromGallery from "./FromGallery";
import { TeeSign } from "src/types/course";
import ErrorScreen from "@components/ErrorScreen";
import { useTranslation } from "react-i18next";
import Stack from "@components/Stack";
import { Text } from 'react-native-paper';
import { stampToDateString } from "src/utils/time";
import Loading from "@components/Loading";

type Props = {
    teeSign: TeeSign
    onImageUpload?: (uri: string) => void
}

const CLOUD_NAME = 'dz4rbnmyw';

const TeeSignImage: FC<Props> = ({ teeSign, onImageUpload }) => {
    const { publicId, uploadedAt } = teeSign;
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = React.useState(false);
    const { t } = useTranslation();

    const imageUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/fudisc-tee-signs/${publicId}?t=${uploadedAt}`;

    if (isError) {
        return <ErrorScreen errorMessage={t('screens.game.holeMap.failedToLoad')} showBackToFrontpage={false} />;
    }

    return (
        <View style={{ flex: 1 }}>
            {isLoading && (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Loading loadingText={t('screens.game.holeMap.imageLoading')} />
                </View>
            )}

            <ReactNativeZoomableView
                minZoom={1}
                maxZoom={8}
            >
                <Image
                    source={{ uri: imageUrl }}
                    onLoadStart={() => setIsLoading(true)}
                    onLoadEnd={() => setIsLoading(false)}
                    key={uploadedAt}
                    onError={() => setIsError(true)}
                    style={{
                        width: "100%",
                        height: "100%",
                        resizeMode: 'contain',
                    }}
                />
            </ReactNativeZoomableView>
            <Stack direction="row" style={styles.buttons} justifyContent="space-between" alignItems="center">
                <View style={styles.text}>
                    <Text variant="bodySmall">{t('screens.game.holeMap.uploadedBy')} {teeSign.uploadedBy.name}</Text>
                    <Text variant="bodySmall">{stampToDateString(+teeSign.uploadedAt * 1000)}</Text>
                </View>
                {onImageUpload && (
                    <Stack direction="row" gap={4}>
                        <TakePhoto onImageUpload={onImageUpload} iconOnly />
                        <FromGallery onImageUpload={onImageUpload} iconOnly />
                    </Stack>
                )}
            </Stack>
        </View>
    );
};

const styles = StyleSheet.create({
    buttons: {
        position: 'absolute',
        bottom: 0,
        left: 5,
        right: 5
    },
    text: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 6
    }
});

export default TeeSignImage;
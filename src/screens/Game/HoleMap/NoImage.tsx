import React from 'react';
import Spacer from "@components/ThemedComponents/Spacer";
import { FC } from "react";
import { Text } from "react-native-paper";
import { View, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';
import TakePhoto from "./TakePhoto";
import { useTranslation } from 'react-i18next';
import FromGallery from './FromGallery';

type Props = {
    onImageUpload: (uri: string) => void
}

const NoImage: FC<Props> = ({onImageUpload}) => {
    const { t } = useTranslation();

    return (
        <ScrollView style={{ flex: 1 }}>
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
                <TakePhoto onImageUpload={onImageUpload} />
                <FromGallery onImageUpload={onImageUpload} />
            </View>
        </ScrollView>
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
        gap: 10
    }
});

export default NoImage;
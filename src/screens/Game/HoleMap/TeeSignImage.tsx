import React, { type FC } from "react";
import { Dimensions, Image, ScrollView, View } from "react-native";

type Props = {
    publidId: string
}

const CLOUD_NAME = 'dz4rbnmyw';

const TeeSignImage: FC<Props> = ({ publidId }) => {
    const imageUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/fudisc-tee-signs/${publidId}`;
    return (
        <View
            style={{flex: 1}}
        >
        <Image
            source={{uri: imageUrl}}
            style= {{
                width: "100%",
                height: "100%"
            }}
            resizeMode="contain"
            />
        </View>
    );
};

export default TeeSignImage;
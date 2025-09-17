import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import React, { type FC } from "react";
import { Dimensions, Image, ScrollView, View } from "react-native";

type Props = {
    publidId: string
}

const CLOUD_NAME = 'dz4rbnmyw';

const TeeSignImage: FC<Props> = ({ publidId }) => {
    const imageUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/fudisc-tee-signs/${publidId}`;
    return (
        <View style={{ flex: 1 }}>
            <ReactNativeZoomableView
                minZoom={1}
                maxZoom={8}
            >
            <Image
                source={{uri: imageUrl}}
                onError={(e) => console.log(e)}
                style= {{
                    width: "100%",
                    height: "100%",
                    resizeMode: 'contain',
                    borderWidth: 2
                }}
                />
            </ReactNativeZoomableView>
        </View>
    );
};

export default TeeSignImage;
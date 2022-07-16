import React from 'react';
import { View } from "react-native";

type SpacerProps = {
    size?: number,
}

export default function Spacer ({ size = 10 }: SpacerProps ) {
    return (
        <View style={{ marginVertical: size }} />
    );
}
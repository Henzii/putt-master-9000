import React from 'react';
import type { ViewStyle } from 'react-native';
import { Button } from "react-native-paper";

type SelectButtonProps = {
    selected?: boolean
    onPress?: (name: string) => void,
    name: string,
    style?: ViewStyle,
    children: React.ReactNode
}
const SelectButton = ({selected, onPress, name, style, children }: SelectButtonProps) => {
    const handlePress = () => {
        onPress?.(name);
    };
    return (
        <Button style={style} onPress={handlePress} mode={selected ? 'outlined' : 'contained'} >
            {children}
        </Button>
    );
};

export default SelectButton;
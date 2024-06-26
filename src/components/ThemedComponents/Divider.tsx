import React from 'react';
import { StyleSheet } from 'react-native';
import { Divider as PaperDivider, useTheme} from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

type Props = {
    margin?: number
    opacity?: number
}

const Divider = ({margin=13, opacity = 0.5}: Props) => {
    const { colors } = useTheme();
    const tyyli = styles(colors, margin);
    return (
        <PaperDivider style={[tyyli.root, {opacity}]} />
    );
};

const styles = (colors: MD3Colors, margin: number) => StyleSheet.create({
    root: {
        marginTop: margin,
        marginBottom: margin,
        height: 1,
        borderTopWidth: 1,
        borderColor: colors.primary,
    }
});

export default Divider;
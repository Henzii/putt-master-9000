import React from 'react';
import { StyleSheet } from 'react-native';
import { Divider as PaperDivider, useTheme} from 'react-native-paper';

const Divider = ({margin=13}: {margin?: number}) => {
    const { colors } = useTheme();
    const tyyli = styles(colors, margin);
    return (
        <PaperDivider style={tyyli.root} />
    );
};

const styles = (colors: ReactNativePaper.ThemeColors, margin: number) => StyleSheet.create({
    root: {
        marginTop: margin,
        marginBottom: margin,
        height: 1,
        borderTopWidth: 1,
        borderColor: colors.primary,
        opacity: 0.5
    }
});

export default Divider;
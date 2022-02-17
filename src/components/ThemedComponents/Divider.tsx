import React from 'react';
import { StyleSheet } from 'react-native';
import { Divider as PaperDivider, useTheme} from 'react-native-paper';

const Divider = () => {
    const { colors } = useTheme();
    return (
        <PaperDivider style={[tyyli.root, { backgroundColor: colors.primary, opacity: 0.7 }]} />
    );
};

const tyyli = StyleSheet.create({
    root: {
        marginTop: 13,
        marginBottom: 13,
        height: 1,
        width: '100%',
    }
});

export default Divider;
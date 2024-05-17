import React, { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import RoundBottom from './RoundBottom';

type Props = {
    children: ReactNode
    color?: string
}
const RoundedHeader = ({children, color}: Props) => {
    const {colors} = useTheme();
    const backgroundColor = color ?? colors.primary;
    return (
        <View>
            <View style={[styles.container, {backgroundColor}]}>
                {children}
            </View>
            <RoundBottom fill={backgroundColor} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingBottom: 20
    }
});

export default RoundedHeader;
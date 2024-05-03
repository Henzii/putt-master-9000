import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import RoundBottom from '../RoundBottom';

type Props = {
    children: ReactNode
}

const WithBackground = ({children}: Props) => {
    const {colors} = useTheme();
    return (
        <View>
        <View style={{backgroundColor: colors.primary, paddingBottom: 20, paddingHorizontal: 20}}>
            {children}
        </View>
        <RoundBottom fill={colors.primary} />
        </View>
    );
};

export default WithBackground;
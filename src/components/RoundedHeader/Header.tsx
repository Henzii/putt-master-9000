import React, { FC, ReactNode } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import RoundBottom from './RoundBottom';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

type Props = {
    children: ReactNode
    setSpacing?: (spacing: number) => void
    withRoundedBottom?: boolean
    bottomSize?: number
}
const Header: FC<Props> = ({children, setSpacing, withRoundedBottom = true, bottomSize}) => {
    const {colors} = useTheme();
    const styles = createStyles(colors);

    const handleOnLayout = (event: LayoutChangeEvent) => {
        const {height} = event.nativeEvent.layout;
        if (height && setSpacing) {
            setSpacing(height / 2 + 10);
        }
    };

    return (
        <View style={styles.container} onLayout={handleOnLayout}>
            <View style={[styles.contentContainer]}>
                {children}
            </View>
            {withRoundedBottom ? <RoundBottom fill={colors.primary} size={bottomSize} /> : null}
        </View>
    );
};
const createStyles = (colors: MD3Colors) =>  StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        zIndex: 2
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: colors.primary
    }
});

export default Header;
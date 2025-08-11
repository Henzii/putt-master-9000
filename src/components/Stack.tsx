import React from 'react';
import { FC, ReactNode } from "react";
import { View } from "react-native";

type Props = {
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse',
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline',
    alignContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch',
    gap?: number,
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly',
    justifyItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline',
    children: ReactNode
}

const Stack: FC<Props> = (props) => {
    const { children, direction, ...styles } = props;
    return (
        <View style={{
            flexDirection: direction || 'column',
            ...styles
        }}>
            {children}
        </View>
    );
};

export default Stack;

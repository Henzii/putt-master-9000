import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, TouchableHighlightComponent } from 'react-native';
import { theme } from '../utils/theme';

export default function Button ({ text, onClick, width, heigth, ...props }:ButtonProps) {
    const [pressed, setPressed] = useState(false);
    const tyyli = StyleSheet.create({
        main: {
            backgroundColor: props.backgroundColor || theme.colors.primary,
            width: (props.fullWidth ? '100%' : (width || 'auto')),
            height: heigth || '120%',
            padding: (props.fullWidth ? 20 : 5),
            borderRadius: (props.fullWidth ? 0 : 10),
            borderColor: props.borderColor || 'black',
            borderWidth: props.borderWidth || 1,
            shadowColor: '#000',
            shadowOpacity: props.shadowOpacity || 0.5,
            shadowRadius: 4,
            shadowOffset: props.shadowOffcet || { width: 4, height: 4},
        },
        pressed: {
            shadowOffset: { width: -1, height: -1},
        },
        text: {
            textAlign: 'center',
            fontSize: theme.font.sizes.large,
            color: (props.color ? theme.font.color[props.color] : theme.font.color.primary)
        }
    });
    return (
        <View style={[tyyli.main, (pressed) ? tyyli.pressed: null ]}>
            <Pressable onPress={onClick} onPressIn={() => setPressed(true)} onPressOut={() => setPressed(false)}>
                <Text style={tyyli.text}>
                    {text}
                </Text>
            </Pressable>
        </View>
    );
}

export type ButtonProps = {
    text: string,
    onClick?: () => void,
    color?: 'primary' | 'secondary',
    width?: string,
    heigth?: number,
    fullWidth?: boolean
    borderColor?: string,
    borderWidth?: number,
    backgroundColor?: string,
    shadowOpacity?: number,
    shadowOffcet?: { width: number, height: number }
}

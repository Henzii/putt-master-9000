import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

export default function Button ({ text, onClick, width, heigth, ...props }:ButtonProps) {
    const tyyli = StyleSheet.create({
        main: {
            backgroundColor: props.backgroundColor || theme.colors.primary,
            
            width: width || 'auto',
            height: heigth || 'auto',
            padding: 5,

            borderRadius: 10,
            borderColor: props.borederColor,
            borderWidth: props.borderWidth,

            shadowColor: 'black',
            shadowOpacity: props.shadowOpacity || 0.5,
            shadowRadius: 4,
            shadowOffset: props.shadowOffcet || { width: 4, height: 4},
            
            textAlign: 'center',
        }
    })
    return (
        <View style={tyyli.main}>
            <Pressable onPress={onClick}>
                <Text style={{ color: 'lightgray', fontSize: 20}}>
                    {text}
                </Text>
            </Pressable>
        </View>
    )
}

export type ButtonProps = {
    text: string,
    onClick?: () => void,
    width?: string,
    heigth?: string,
    borederColor?: string,
    borderWidth?: number,
    backgroundColor?: string,
    shadowOpacity?: number,
    shadowOffcet?: { width: number, height: number }
}

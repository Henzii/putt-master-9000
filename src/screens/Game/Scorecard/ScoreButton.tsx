import React from 'react';
import { Pressable } from 'react-native';
import { ActivityIndicator, useTheme, Text } from 'react-native-paper';
import { createStyles } from './styles';

type Props = {
    par?: number
    onClick?: (score: number) => void
    number: number
    selected: boolean
    pending: boolean
}

export const ScoreButton = ({ onClick, number, selected, pending, par }: Props) => {
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const bgStyles = [
        styles.scoreButton,
        (par === number) && styles.scoreButtonPar,
        selected && styles.scoreButtonSelected,
        pending && styles.scoreButtonPending
    ];
    const handleClick = () => {
        onClick?.(number);
    };

    return (
        <Pressable
            style={bgStyles}
            onPress={handleClick}
        >
            {pending ? (
                <ActivityIndicator />
            ) : (
                <Text style={styles.scoreButtonText}>{number}</Text>
            )}
        </Pressable>
    );
};

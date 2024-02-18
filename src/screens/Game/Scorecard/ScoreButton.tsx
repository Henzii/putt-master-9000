import React from 'react';
import { Text, Pressable } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { styles } from './styles';

type Props = {
    par?: number
    onClick?: (score: number) => void
    number: number
    selected: boolean
    pending: boolean
}

export const ScoreButton = ({ onClick, number, selected, pending, par }: Props) => {

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

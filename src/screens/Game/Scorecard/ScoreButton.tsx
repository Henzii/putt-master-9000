import React from 'react';
import { Pressable } from 'react-native';
import { ActivityIndicator, useTheme, Text } from 'react-native-paper';
import { createStyles } from './styles';
import { scoreColor, type AppTheme } from '../../../utils/theme';

type Props = {
    par?: number
    scorePar: number
    onClick?: (score: number) => void
    number: number
    selected: boolean
    pending: boolean
}

export const ScoreButton = ({ onClick, number, selected, pending, par, scorePar }: Props) => {
    const { colors } = useTheme<AppTheme>();
    const styles = createStyles(colors);
    const bgStyles = [
        styles.scoreButton,
        (par === number) && styles.scoreButtonPar,
        selected && { backgroundColor: scoreColor(number - scorePar, colors.scoreColors) }
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
                <Text style={[styles.scoreButtonText, selected && { color: colors.onSurface }]}>{number}</Text>
            )}
        </Pressable>
    );
};

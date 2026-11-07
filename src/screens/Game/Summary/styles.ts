import { StyleSheet } from "react-native";
import { MD3Colors } from "react-native-paper/lib/typescript/types";

export const createTableStyles = (colors: MD3Colors) => StyleSheet.create({
    headerText: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.onSurfaceVariant,
    },
    rank: {
        maxWidth: 15,
    },
    player: {
        height: 53,
    },
    score: {
        width: 33,
        height: 53,
        justifyContent: 'center',
    },
    scoreText: {
        fontSize: 12,
        fontWeight: '800',
        color: colors.onSurface,
    },
    total: {
        minWidth: 50,
        justifyContent: 'center',
    },
    totalPlusMinus: {
        width: 50,
        justifyContent: 'center',
    },
    totalText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.onSurface,
    }
});
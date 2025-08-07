import { StyleSheet } from "react-native";
import { scoreColors } from "../../../utils/theme";

export const tableStyles = StyleSheet.create({
    headerText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#5f6a7e',
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
        color: '#3d4f3a'
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
        color: 'black',
    }
});

export const scoreColor = (plusMinus: number) => {
    switch(plusMinus) {
        case -3: return scoreColors.alba;
        case -2: return scoreColors.eagle;
        case -1: return scoreColors.birdie;
        case 0: return scoreColors.par;
        case 1: return scoreColors.bogey;
        case 2: return scoreColors.doubleBogey;
        default: return scoreColors.other;
    }
};
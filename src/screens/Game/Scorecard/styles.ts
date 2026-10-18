import { StyleSheet } from 'react-native';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';


export const createStyles = (colors: MD3Colors) => StyleSheet.create({
    scoreButton: {
        marginRight: 5,
        borderWidth: 1,
        borderColor: colors.outline,
        backgroundColor: colors.secondary,
        width: 45,
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 7,
        elevation: 2,
    },
    throwingOrderText: {
        fontSize: 12,
        opacity: 0.2,
        marginTop: -6,
    },
    scoreButtons: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    scoreButtonPending: {
        borderColor: 'green',
        backgroundColor: '#D3DFD3'
    },
    scoreButtonPar: {
        borderWidth: 2,
    },
    scoreButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.onSecondary,
    },
    scoreButtonSelected: {
        backgroundColor: '#8ecf8a',
        borderColor: 'green',
    },
    plusMinus: {
        fontSize: 21,
        fontWeight: 'bold',
    },
    container: {
        elevation: 3,
        width: '96%',
        alignSelf: 'center',
        marginBottom: 8,
        borderRadius: 4,
        backgroundColor: colors.surface,
    },
    header: {
        backgroundColor: colors.secondaryContainer,
        paddingVertical: 7,
        paddingHorizontal: 15,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
    },
    title: {
        fontSize: 21,
        fontWeight: '600',
    }
});

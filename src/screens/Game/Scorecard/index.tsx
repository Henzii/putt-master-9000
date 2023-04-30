import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, LayoutChangeEvent, Pressable } from 'react-native';
import { useSettings } from '../../../components/LocalSettingsProvider';
import { Scorecard } from '../../../hooks/useGame';
import { StatsHook } from '../../../hooks/useStats';
import Statsbar from './Statsbar';
import SplitContainer from '../../../components/ThemedComponents/SplitContainer';
import { ActivityIndicator, useTheme } from 'react-native-paper';

type PlayerArgs = {
    player: Scorecard,
    selectedRound: number,
    setScore: (playerId: string, selectedRound: number, value: number) => void,
    stats: StatsHook,
    par: number
}
/**
 *  ### Pejaala
 *  Renderöi yhden pelaajan + tulosnapit
 *
 *  @param player Pelaajan Scorecard
 *  @param selectedRound Valittu kierros
 *  @param setScore callback tuloksen asettamiselle. Saa parateriksi tuloksen
 */
export default function Player({ player, selectedRound, setScore, stats, par }: PlayerArgs): JSX.Element {
    const [pendingButton, setPendingButton] = useState<number | undefined>();
    const listRef = useRef<FlatList>(null);
    const [viewWidth, setViewWidth] = useState<number>(0);
    const theme = useTheme();
    const napitData = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    // Tulosten päivittyessä poistetaan pelaajalta pending
    useEffect(() => {
        if (pendingButton) setPendingButton(undefined);
    }, [player]);
    // Valittu rata vaihtuu, scrollataan alkuun
    useEffect(() => {
        listRef.current?.scrollToIndex({ index: 0 });
    }, [selectedRound]);
    const settings = useSettings();
    const handleButtonClick = (score: number) => {
        setScore(player.user.id as string, selectedRound, score);
        setPendingButton(score);
    };
    const handleOnLayout = (event: LayoutChangeEvent) => {
        if (!viewWidth) setViewWidth(event.nativeEvent.layout.width);
    };

    const plusMinus = player.plusminus ?? 0;
    return (
        <View style={[tyyli.container, {backgroundColor: theme.colors.surface}]} onLayout={handleOnLayout}>
            <SplitContainer style={tyyli.header}>
                <Text style={tyyli.title}>{player.user.name}</Text>
                {!settings.getBoolValue('HidePlusMinus') &&
                    <Text style={tyyli.plusMinus}>{`${plusMinus > 0 ? '+' : ''}${plusMinus}`}</Text>
                }
            </SplitContainer>
                <View style={tyyli.scoreButtons}>
                    <FlatList
                        ref={listRef}
                        data={napitData}
                        renderItem={({ item, index }) => {
                            return <ScoreButton
                                number={item}
                                onClick={handleButtonClick}
                                par={!player.scores[selectedRound] ? par : undefined}
                                selected={(player.scores[selectedRound] - 1 === index)}
                                pending={(pendingButton === item)}
                            />;
                        }}
                        horizontal
                        onEndReached={() => {
                            if (napitData.length < 50) napitData.push(napitData.length + 1);
                        }}
                        onEndReachedThreshold={0.1}
                        keyExtractor={item => 'avain' + player.user.id + item}
                        initialScrollIndex={0}
                    />
                </View>
            {!settings.getBoolValue('HideStatsBars') &&
                <Statsbar statsCard={stats.getStatsForHole(player.user.id as string, selectedRound)} viewWidth={viewWidth} />}
        </View>

    );

}
const ScoreButton = ({ onClick, number, selected, pending, par }: { par?: number, onClick?: (score: number) => void, number: number, selected: boolean, pending: boolean }) => {

    const bgStyles = [
        tyyli.scoreButton,
        (par === number) && tyyli.scoreButtonPar,
        selected && tyyli.scoreButtonSelected,
        pending && tyyli.scoreButtonPending
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
                <Text style={tyyli.scoreButtonText}>{number}</Text>
            )}
        </Pressable>
    );
};

const tyyli = StyleSheet.create({
    scoreButton: {
        marginRight: 5,
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: 'lightgray',
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
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    scoreButtonPending: {
        borderColor: 'green',
        backgroundColor: '#D3DFD3'
    },
    scoreButtonPar: {
        backgroundColor: '#D3DFD3',
    },
    scoreButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4a4a4a'
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
        marginBottom: 6,
        borderRadius: 4,
    },
    header: {
        backgroundColor: "#d3e3d3",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
    },
    title: {
        fontSize: 21,
        fontWeight: '600',
    }
});

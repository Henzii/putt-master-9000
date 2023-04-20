import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, LayoutChangeEvent, Animated } from 'react-native';
import { ActivityIndicator, Card } from 'react-native-paper';
import { useSettings } from '../../components/LocalSettingsProvider';
import { Scorecard } from '../../hooks/useGame';
import { StatsHook } from '../../hooks/useStats';
import Statsbar from './Statsbar';

type PlayerArgs = {
    player: Scorecard,
    selectedRound: number,
    setScore: (playerId: string, selectedRound: number, value: number) => void,
    order?: number,
    stats: StatsHook
}
/**
 *  ### Pejaala
 *  Renderöi yhden pelaajan + tulosnapit
 *
 *  @param player Pelaajan Scorecard
 *  @param selectedRound Valittu kierros
 *  @param setScore callback tuloksen asettamiselle. Saa parateriksi tuloksen
 */
export default function Player({ player, selectedRound, setScore, order, stats }: PlayerArgs): JSX.Element {
    const [pendingButton, setPendingButton] = useState<number | undefined>();
    const listRef = useRef<FlatList>(null);
    const [viewWidth, setViewWidth] = useState<number>(0);
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
    return (
        <Card style={[tyyli.main, (order === 1 && tyyli.hasBox)]} onLayout={handleOnLayout}>
            <Card.Title
                style={tyyli.title}
                title={player.user.name}
                right={() => <Text style={tyyli.throwingOrderText}>{order}</Text>}
            />
            <Card.Content style={tyyli.content}>
                <View style={tyyli.contentLeft}>
                    <FlatList
                        ref={listRef}
                        data={napitData}
                        renderItem={({ item, index }) => {
                            return <ScoreButton
                                number={item}
                                onClick={handleButtonClick}
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
                <View style={tyyli.contentRight}>
                    <Text style={tyyli.crText}>
                        {((player.plusminus || 0) > 0 ? '+' : '')}
                        {player.plusminus}
                    </Text>
                    {(player.scores[selectedRound] > 5) ?
                        <Text>&nbsp;
                            ({player.scores[selectedRound]})
                        </Text>
                        : null
                    }
                </View>
            </Card.Content>
            {!settings.getBoolValue('HideStatsBars') &&
            <Statsbar statsCard={stats.getStatsForHole(player.user.id as string, selectedRound)} viewWidth={viewWidth} />}
        </Card>

    );

}
const ScoreButton = ({ onClick, number, selected, pending }: { onClick?: (score: number) => void, number: number, selected: boolean, pending: boolean }) => {
    const bgStyles = [
        tyyli.scoreButton,
        selected && tyyli.scoreButtonSelected,
    ];
    if (pending) return <PendingButton />;
    return (
        <Pressable
            style={bgStyles}
            onPress={onClick?.bind(this, number)}
        >
            <Text>{number}</Text>
        </Pressable>
    );
};

const PendingButton = () => {
    const borderAnim = useRef(new Animated.Value(0)).current;
    (function startAnim() {

        Animated.timing(borderAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    })();
    return (
        <Animated.View
            style={[
                tyyli.scoreButton,
                tyyli.scoreButtonPending,
                {
                    borderRadius: borderAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [7, 30]
                    }),
                }
            ]}
        >
            <Text><ActivityIndicator /></Text>
        </Animated.View>
    );
};

const tyyli = StyleSheet.create({
    scoreButton: {
        marginRight: 5,
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: 'lightgray',
        width: 43,
        height: 43,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 7,
        elevation: 2,
    },
    throwingOrderText: {
        fontSize: 12,
        opacity: 0.6,
    },
    hasBox: {
        backgroundColor: '#FFFFE5',
    },
    scoreButtonPending: {
        borderColor: 'green',
    },
    scoreButtonSelected: {
        backgroundColor: '#8ecf8a',
        borderColor: 'green',
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-around'
    },
    contentLeft: {
        flex: 4,
    },
    contentRight: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    crText: {
        fontSize: 23,
    },
    main: {
        minHeight: 120,
        elevation: 2,
        width: '98%',
        alignSelf: 'center',
        marginBottom: 1,
    },
    title: {
        padding: 10,
    }
});

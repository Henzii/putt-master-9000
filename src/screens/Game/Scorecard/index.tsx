import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, LayoutChangeEvent } from 'react-native';
import { useSettings } from '../../../components/LocalSettingsProvider';
import useStats from '../../../hooks/useStats';
import Statsbar from './Statsbar';
import SplitContainer from '../../../components/ThemedComponents/SplitContainer';
import { useTheme } from 'react-native-paper';
import type { Scorecard } from '../../../types/game';
import { ScoreButton } from './ScoreButton';
import { styles } from './styles';

type PlayerArgs = {
    player: Scorecard,
    selectedRound: number,
    setScore: (playerId: string, selectedRound: number, value: number, playerName?: string) => void,
    par: number,
    layoutId: string
}

type PendingState = {
    selectedRound: number,
    pendingScore: number
}

const Player = React.memo(function Scorecard ({ player, selectedRound, setScore, par, layoutId }: PlayerArgs) {
    const [pendingButton, setPendingButton] = useState<PendingState>();
    const listRef = useRef<FlatList>(null);
    const [viewWidth, setViewWidth] = useState<number>(0);
    const theme = useTheme();
    const napitData = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const stats = useStats(layoutId, [player.user.id as string]);

    useEffect(() => {
        if (pendingButton) {
            if (player.scores[pendingButton.selectedRound] === pendingButton.pendingScore) {
                setPendingButton(undefined);
            }
        }
    }, [player, pendingButton]);

    useEffect(() => {
        listRef.current?.scrollToIndex({ index: 0 });
    }, [selectedRound]);
    const settings = useSettings();
    const handleButtonClick = (score: number) => {
        setScore(player.user.id as string, selectedRound, score);
        setPendingButton({selectedRound, pendingScore: score});
    };
    const handleOnLayout = (event: LayoutChangeEvent) => {
        if (!viewWidth) setViewWidth(event.nativeEvent.layout.width);
    };

    const plusMinus = player.plusminus ?? 0;
    return (
        <View style={[styles.container, {backgroundColor: theme.colors.surface}]} onLayout={handleOnLayout}>
            <SplitContainer style={styles.header}>
                <Text style={styles.title}>{player.user.name}</Text>
                {!settings.getBoolValue('HidePlusMinus') &&
                    <Text style={styles.plusMinus}>{`${plusMinus > 0 ? '+' : ''}${plusMinus}`}</Text>
                }
            </SplitContainer>
                <View style={styles.scoreButtons}>
                    <FlatList
                        ref={listRef}
                        data={napitData}
                        renderItem={({ item, index }) => {
                            return <ScoreButton
                                number={item}
                                onClick={handleButtonClick}
                                par={!player.scores[selectedRound] ? par : undefined}
                                selected={(player.scores[selectedRound] - 1 === index)}
                                pending={(pendingButton?.pendingScore === item && pendingButton?.selectedRound === selectedRound)}
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
});

export default Player;

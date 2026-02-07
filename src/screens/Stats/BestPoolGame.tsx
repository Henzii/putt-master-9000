import React, { useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Chip, Headline, Paragraph, TextInput, Title } from "react-native-paper";
import { useTranslation } from 'react-i18next';
import Spacer from '../../components/ThemedComponents/Spacer';
import useTextInput from '../../hooks/useTextInput';
import { useQuery } from '@apollo/client';
import { BEST_POOL } from '../../graphql/queries';
import Loading from '../../components/Loading';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../reducers/notificationReducer';
import { parseDate } from '../../utils/dates';
import { Game } from '../../types/game';

type Props = {
    layoutId: string | number,
}

type BestPoolResponse = {
    getBestPoolForLayout: {
        gamesCount: number
        totalPar: number
        totalScore: number
        game: Game
    }
}

const BestPoolGame = ({layoutId}: Props) => {
    const { t } = useTranslation();
    const [numberOfPlayers, setNumberOfPlayers] = useState(4);
    const {data, loading} = useQuery<BestPoolResponse>(BEST_POOL, {
        variables: {layoutId, players: numberOfPlayers},
        fetchPolicy: 'cache-first'
    });
    const dispatch = useDispatch();

    const handleSetPlayersCount = (value: string) => {
        const valueNumber = +value;
        if (isNaN(valueNumber) || valueNumber < 2 || valueNumber > 10) {
            dispatch(addNotification('Pool size should be between 2 - 10'));
        }
        else {
            setNumberOfPlayers(valueNumber);
        }
    };

    const input = useTextInput({
        callBackDelay: 1000,
        numeric: true,
        defaultValue: numberOfPlayers.toString()
    }, handleSetPlayersCount);

    const gameData = data?.getBestPoolForLayout;

    return (
        <View>
            <Headline>{t('screens.stats.bestPoolGame.title')}</Headline>
            <Paragraph>
                {t('screens.stats.bestPoolGame.info')}
            </Paragraph>
            <View style={styles.input}>
                <Text>{t('screens.stats.bestPoolGame.poolLabel')}</Text>
                <TextInput {...input} dense mode="outlined" />
            </View>
            <Spacer size={5} />
            {!gameData ? (
                loading ? <Loading /> : <Text>{t('screens.stats.bestPoolGame.noData')}</Text>
            ) : (
                <View>
                    <View style={styles.infoContainer}>
                        <Text>{t('screens.stats.bestPoolGame.eligibleGames')}</Text><Text style={styles.infoValue}> {gameData.gamesCount}</Text>
                    </View>
                    <Spacer size={5} />
                    <Title>{gameData.game.course} / {gameData.game.layout}</Title>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>{t('screens.stats.bestPoolGame.date')}</Text><Text style={styles.infoValue}>{parseDate(gameData.game.startTime ?? 0)}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>{t('screens.stats.bestPoolGame.players')}</Text><Text style={styles.infoValue}>{gameData.game.scorecards.length}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>{t('screens.stats.bestPoolGame.totalScore')}</Text><Text style={styles.infoValue}>{gameData.totalScore}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>{t('screens.stats.bestPoolGame.totalPar')}</Text><Text style={styles.infoValue}>{gameData.totalPar}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>{t('screens.stats.bestPoolGame.totalAdjusted')}</Text><Text style={styles.infoValue}>{gameData.totalScore - gameData.totalPar}</Text>
                    </View>
                    <Spacer size={5} />
                    <View style={styles.infoContainer}>
                        <Text style={[styles.infoText, styles.largeText]}>{t('screens.stats.bestPoolGame.adjustedAdjusted')}</Text><Text style={[styles.infoValue, styles.largeText]}>{(gameData.totalScore - gameData.totalPar) / gameData.game.scorecards.length}</Text>
                    </View>
                    <Spacer size={5} />
                    <Title>{t('screens.stats.bestPoolGame.playersTitle')}</Title>
                    <Spacer size={5} />
                    <View style={styles.playersContainer}>
                        {gameData.game.scorecards.map(sc => <Chip icon="account" key={sc.user.name}>{sc.user.name} ({sc.plusminus})</Chip>)}
                    </View>
                    <Spacer />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    playersContainer: {
        flexDirection: 'row',
        gap: 5,
        flexWrap: 'wrap'
    },
    input: {
        flexDirection: 'row',
        alignItems: "center",
        gap: 10
    },
    infoText: {
        flexBasis: 110,
    },
    infoValue: {
        fontWeight: "700"
    },
    infoContainer: {
        flexDirection: 'row'
    },
    largeText: {
        fontSize: 16
    }
});

export default BestPoolGame;

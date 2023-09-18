import React, { useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Chip, Headline, Paragraph, TextInput, Title } from "react-native-paper";
import Spacer from '../../components/ThemedComponents/Spacer';
import useTextInput from '../../hooks/useTextInput';
import { useQuery } from '@apollo/client';
import { BEST_POOL } from '../../graphql/queries';
import Loading from '../../components/Loading';
import { Game } from '../../hooks/useGame';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../reducers/notificationReducer';
import { parseDate } from '../../utils/dates';

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
            <Headline>Masters of the universe</Headline>
            <Paragraph>
                Shows best played game on selected layout with a pool size of n.
            </Paragraph>
            <View style={styles.input}>
                <Text>Show best game for pool size: </Text>
                <TextInput {...input} dense mode="outlined" />
            </View>
            <Spacer size={5} />
            {!gameData ? (
                loading ? <Loading /> : <Text>No data :P</Text>
            ) : (
                <View>
                    <View style={styles.infoContainer}>
                        <Text>Eligible games found: </Text><Text style={styles.infoValue}> {gameData.gamesCount}</Text>
                    </View>
                    <Spacer size={5} />
                    <Title>{gameData.game.course} / {gameData.game.layout}</Title>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>Date:</Text><Text style={styles.infoValue}>{parseDate(gameData.game.startTime ?? 0)}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>Players:</Text><Text style={styles.infoValue}>{gameData.game.scorecards.length}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>Total score:</Text><Text style={styles.infoValue}>{gameData.totalScore}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>Total par:</Text><Text style={styles.infoValue}>{gameData.totalPar}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>+/- Total:</Text><Text style={styles.infoValue}>{gameData.totalScore - gameData.totalPar}</Text>
                    </View>
                    <Spacer size={5} />
                    <View style={styles.infoContainer}>
                        <Text style={[styles.infoText, styles.largeText]}>+/- Adjusted:</Text><Text style={[styles.infoValue, styles.largeText]}>{(gameData.totalScore - gameData.totalPar) / gameData.game.scorecards.length}</Text>
                    </View>
                    <Spacer size={5} />
                    <Title>Players</Title>
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
        flexBasis: '30%',
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

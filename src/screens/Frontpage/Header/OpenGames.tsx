import React from 'react';
import { Game } from '../../../types/game';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import SplitContainer from '../../../components/ThemedComponents/SplitContainer';
import Spacer from '../../../components/ThemedComponents/Spacer';
import { useNavigate } from 'react-router-native';
import { parseDate } from '../../../utils/dates';
import { getCompletedHoles } from '../utils';

type OpenGamesProps = {
    openGames: Game[]
}

const OpenGames = ({ openGames }: OpenGamesProps) => {
    const nav = useNavigate();

    if (!openGames.length) return null;
    if (openGames.length > 1) {
        return (
            <View style={styles.info}>
                <SplitContainer>
                    <Text>You have {openGames.length} unfinished games</Text>
                </SplitContainer>
            </View>
        );
    }

    const game = openGames[0];

    const handleContinueGame = () => {
        nav(`/game/${game.id}`);
    };

    const completedHoles = getCompletedHoles(game);

    return (
        <>
            <SplitContainer>
                <Text style={styles.mainText}>{game.course}</Text>
                <Text style={styles.secText}>{game.scorecards.length} players</Text>
            </SplitContainer>
            <SplitContainer>
                <Text style={styles.secText}>{game.layout}</Text>
                <Text style={styles.secText}>{parseDate(game.startTime)}</Text>
            </SplitContainer>
            <SplitContainer>
                <View />
                <Text style={styles.secText}>{`${completedHoles} / ${game.holes}`} completed</Text>
            </SplitContainer>
            <Spacer />
            <View style={{ flexDirection: 'row' }}>
                <Button icon="reload" style={styles.continueButton} textColor="black" onPress={handleContinueGame}>Continue</Button>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    infoContainer: {
        padding: 20,
    },
    continueButton: {
        backgroundColor: 'white',
        flex: 0,
    },
    mainText: {
        color: 'white',
        fontSize: 22
    },
    secText: {
        color: 'white',
        fontSize: 14
    },
    info: {
        borderRadius: 10,
        elevation: 6,
        backgroundColor: '#E5F9FF',
        width: '90%',
        padding: 10,
        marginTop: 15,
    }
});

export default OpenGames;
import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Player from './Player';
import RoundTabs from './RoundTabs';
import { theme } from '../../utils/theme';
import useGame from '../../hooks/useGame';
import Container from '../ThemedComponents/Container';
import { Button, Paragraph, Title } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { unloadGame } from '../../reducers/gameDataReducer';

export default function Game({ gameId }: { gameId: string }) {
    const [selectedRound, setSelectedRound] = useState(0);
    const { data, ready, error, setScore } = useGame(gameId);
    const handleScoreChange = (playerId: string, selectedRound: number, value: number) => {
        setScore({
            gameId,
            playerId,
            hole: selectedRound,
            value,
        })
    }
    if (error?.message) {
        return (
            <Container>
                <Title>Error!</Title>
                <Paragraph>
                    {error.message}
                </Paragraph>
            </Container>
        )
    }
    if (!data || !ready) {
        return (
            <View>
                <Text>Loading or something....</Text>
            </View>
        )
    }
    if (!data.isOpen) {
        return <ClosedGame />
    }
    return (
        <>
            <RoundTabs gameData={data} selectedRound={selectedRound} setSelectedRound={setSelectedRound} />
            <Container noPadding>
                <View style={peliStyles.headers}>
                    <Text style={peliStyles.course}>{data.course} #{selectedRound + 1}, par {data.pars[selectedRound]}</Text>
                    <Text style={peliStyles.layout}>{data.layout}</Text>
                </View>
                {data.scorecards.map(p =>
                    <Player
                        pars={data.pars}
                        key={p.user.id}
                        player={p}
                        selectedRound={selectedRound}
                        setScore={handleScoreChange}
                    />
                )}
            </Container>
        </>
    )
}
const ClosedGame = () => {
    const dispatch = useDispatch();

    // Uusi peli -> poistetaan pelin tiedot redux-storesta jolloin createGame näkymä avautuu
    const handleButtonClick = () => {
        dispatch(unloadGame());
    }
    return (
        <View style={peliStyles.gameover}>
            <Title style={peliStyles.gameoverText}>Game over!</Title>
            <Button onPress={handleButtonClick}>Start a new game</Button>
        </View>
    )
}
const peliStyles = StyleSheet.create({
    headers: {
        padding: 10,
    },
    gameover: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    gameoverText: {
        color: 'gray',
        fontSize: 30,
    },
    course: {
        fontSize: theme.font.sizes.huge + 5,
        fontWeight: 'bold',
    },
    layout: {
        color: 'gray',
    }
})
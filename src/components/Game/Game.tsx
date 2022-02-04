import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Player from './Player';
import RoundTabs from './RoundTabs';
import { theme } from '../../utils/theme';
import useGame from '../../hooks/useGame';
import Container from '../ThemedComponents/Container';

export default function Game({ gameId }: { gameId: string }) {
    const [selectedRound, setSelectedRound] = useState(0);
    const { data, ready, setScore } = useGame(gameId);
    const handleScoreChange = (playerId: string, selectedRound: number, value: number) => {
        console.log('Setscore for player', playerId, 'round', selectedRound, 'value', value);
        setScore({
            gameId,
            playerId,
            hole: selectedRound,
            value,
        })
    }
    if (!data || !ready) {
        return (
            <View>
                <Text>Loading or something....</Text>
            </View>
        )
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

const peliStyles = StyleSheet.create({
    headers: {
        padding: 10,
    },
    course: {
        fontSize: theme.font.sizes.huge + 5,
        fontWeight: 'bold',
    },
    layout: {
        color: 'gray',
    }
})
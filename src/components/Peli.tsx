import { View, Text } from 'react-native';
import React, { useState } from 'react';
import Player from './Player';
import RoundTabs from './RoundTabs';

const gameData={
    holes: 18,
    pars:[3,3,3,3,4,4,3,4,5,3,4,3,4,5,4,3,3,3],
    players: [
        {
            name: 'Henkka',
            scores: [3,3,3],
            id: 1,
        },
        {
            name: 'Pekka',
            scores:[3,3,4],
            id: 2,
        },
    ]
}

export default function Peli() {
    const [selectedRound, setSelectedRound] = useState(1);
    return (
        <>
        <RoundTabs tabs={gameData.holes} selectedRound={selectedRound} setSelectedRound={setSelectedRound}/>
        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
            <Text>Peli</Text>
            {gameData.players.map(p => <Player name={p.name} key={p.id} />)}
        </View>
        </>
    )
}
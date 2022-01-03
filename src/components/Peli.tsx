import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Player from './Player';
import RoundTabs from './RoundTabs';
import { useSelector } from 'react-redux';
import { RootState } from '../utils/store';
import { gameData } from '../reducers/gameDataReducer';

export default function Peli() {
    const [selectedRound, setSelectedRound] = useState(1);
    const gameData: gameData = useSelector((state: RootState) => state.gameData)
    return (
        <>
            <RoundTabs tabs={gameData.holes} selectedRound={selectedRound} setSelectedRound={setSelectedRound} />
            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                <View style={peliStyles.headers}>
                    <Text style={peliStyles.course}>{gameData.course}</Text>
                    <Text style={peliStyles.layout}>{gameData.layout}</Text>
                </View>
                {gameData.players.map(p => <Player name={p.name} key={p.id} />)}
            </View>
        </>
    )
}

const peliStyles = StyleSheet.create({
    headers: {
        padding: 10,
    },
    course: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    layout: {
        color: 'gray',
    }
})
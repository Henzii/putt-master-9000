import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Player from './Player';
import RoundTabs from './RoundTabs';
import { useSelector } from 'react-redux';
import { RootState } from '../utils/store';
import { gameData } from '../reducers/gameDataReducer';

export default function Peli() {
    const [selectedRound, setSelectedRound] = useState(0);
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    return (
        <>
            <RoundTabs gameData={gameData} selectedRound={selectedRound} setSelectedRound={setSelectedRound} />
            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                <View style={peliStyles.headers}>
                    <Text style={peliStyles.course}>{gameData.course} #{selectedRound+1}</Text>
                    <Text style={peliStyles.layout}>{gameData.layout}</Text>
                </View>
                {gameData.players.map(p => <Player key={p.id} player={p} selectedRound={selectedRound} />)}
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
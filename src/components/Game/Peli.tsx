import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Player from './Player';
import RoundTabs from './RoundTabs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../utils/store';
import { gameData, newGame } from '../../reducers/gameDataReducer';
import { theme } from '../../utils/theme';
import SelectCourses from '../SelectCourse';
import useCourses, { Course, Layout } from '../../hooks/useCourses';
import { Title } from 'react-native-paper';

export default function Peli() {
    const [selectedRound, setSelectedRound] = useState(0);
    const dispatch = useDispatch()

    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    
    const handleNewGame = (layout: Layout, course?: Course) => {
        dispatch(newGame({
            gameId: 'dadkasdkasd',
            course: course?.name || 'Unknown',
            holes: layout.holes,
            layout: layout.name,
            pars: layout.pars,
            players: [
                {
                    name: 'Henkka',
                    scores: [],
                    id: 11
                },
                {
                    name: 'Pekka',
                    scores: [],
                    id: 12
                }
            ]
        }));
    }
    if (!gameData) {
        return (
            <>
                <Title>Select course</Title>
                <SelectCourses onSelect={handleNewGame} />
            </>
        )
    }
    return (
        <>
            <RoundTabs gameData={gameData} selectedRound={selectedRound} setSelectedRound={setSelectedRound} />
            <View style={{ flex: 1, justifyContent: 'flex-start', width: '100%' }}>
                <View style={peliStyles.headers}>
                    <Text style={peliStyles.course}>{gameData.course} #{selectedRound + 1}, par {gameData.pars[selectedRound]}</Text>
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
        fontSize: theme.font.sizes.huge + 5,
        fontWeight: 'bold',
    },
    layout: {
        color: 'gray',
    }
})
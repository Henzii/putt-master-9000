import React from 'react';
import { Text, View } from "react-native"
import { useSelector } from 'react-redux';
import useGame from '../../hooks/useGame';
import { gameData } from '../../reducers/gameDataReducer';
import { RootState } from '../../utils/store';

const Summary = () => {
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    const { data, ready } = useGame(gameData.gameId);
    if (!ready) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        )
    }
    return (
        <View>
            { data?.scorecards.map(s => <Text key={s.user.id}>{s.user.name}</Text> )}
        </View>
    )
}

export default Summary;
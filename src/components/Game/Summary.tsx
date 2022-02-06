import React from 'react';
import { Text, View } from "react-native"
import { DataTable } from 'react-native-paper';
import { useSelector } from 'react-redux';
import useGame from '../../hooks/useGame';
import { gameData } from '../../reducers/gameDataReducer';
import { RootState } from '../../utils/store';

const Summary = () => {
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    const { data, ready } = useGame(gameData.gameId);
    if (!ready || !data) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        )
    }
    const sortedScorecards = [...data.scorecards].sort((a,b) => (a.total || 0) - (b.total || 0))
    return (
        <View>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>#</DataTable.Title>
                    <DataTable.Title>Player</DataTable.Title>
                    <DataTable.Title>Total</DataTable.Title>
                    <DataTable.Title>+/-</DataTable.Title>
                </DataTable.Header>
                {sortedScorecards.map((sc, index) => {
                    return (
                        <DataTable.Row key={sc.user.id}>
                            <DataTable.Cell>{index+1}</DataTable.Cell>
                            <DataTable.Cell>{sc.user.name}</DataTable.Cell>
                            <DataTable.Cell>{sc.total}</DataTable.Cell>
                            <DataTable.Cell>{
                                sc.scores.reduce((p, c, i) => {
                                    if (!c) return p;
                                    return p + (c - data.pars[i])
                                }, 0)}
                            </DataTable.Cell>
                        </DataTable.Row>
                    )
                })}
            </DataTable>
        </View>
    )
}

export default Summary;
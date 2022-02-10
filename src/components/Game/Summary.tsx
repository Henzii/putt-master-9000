import React from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { useSelector } from 'react-redux';
import useGame from '../../hooks/useGame';
import { gameData } from '../../reducers/gameDataReducer';
import { RootState } from '../../utils/store';
import Container from '../ThemedComponents/Container';
import { Table, Rows, Row, Col, TableWrapper } from 'react-native-table-component';
import Loading from '../Loading';

const Summary = () => {
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    const { data, ready } = useGame(gameData.gameId);
    if (!ready || !data) {
        return (
            <Loading />
        )
    }
    const sortedScorecards = [...data.scorecards].sort((a, b) => (a.total || 0) - (b.total || 0))
    const tableHeaders = ['#', 'Player', ...data.pars.map((p, i) => i + 1), 'Total', '+/-', 'bHc', 'hcTot']
    const playersData = sortedScorecards.map((sc, i) => {
        const scoret: (number | string)[] = [...sc.scores];
        // Tehdään tekemättömistä väylistä tyhjiä...
        for (let i = 0; i < data.holes; i++) {
            if (!scoret[i]) scoret[i] = ' ';
        }
        return [i + 1,
        sc.user.name,
        ...scoret,
        sc.total || '?',
        (sc.total || 0) - data.par,
        (sc.beers/2),
        (sc.total || 0) - (sc.beers/2)
        ]
    })
    const leveydet = [20, 80, ...data.pars.map(p => 30), 50, 50, 50, 50]
    return (
        <ScrollView horizontal>
            <Container>
                <Table borderStyle={{ borderWidth: 1 }}>
                    <Row data={tableHeaders} style={tyylit.header} textStyle={tyylit.text} widthArr={leveydet} />
                    <Rows data={playersData} textStyle={tyylit.text} style={tyylit.rivit} widthArr={leveydet} />
                </Table>
            </Container>
        </ScrollView>
    )
}
const tyylit = StyleSheet.create({
    header: {
        backgroundColor: 'rgb(90,200,90)',
    },
    text: {
        textAlign: 'center',
        paddingVertical: 5,
    },
    rivit: {
    }
})
export default Summary;
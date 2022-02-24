import React from 'react';
import { ScrollView, StyleSheet } from "react-native";
import { useSelector } from 'react-redux';
import useGame from '../../hooks/useGame';
import { gameData } from '../../reducers/gameDataReducer';
import { RootState } from '../../utils/store';
import Container from '../ThemedComponents/Container';
import { Table, Rows, Row } from 'react-native-table-component';
import Loading from '../Loading';

const Summary = () => {
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    const { data, ready } = useGame(gameData.gameId);
    if (!ready || !data) {
        return (
            <Loading />
        );
    }
    const sortedScorecards = [...data.scorecards].sort((a, b) => (a.total || 0) - (b.total || 0));
    const tableHeaders = ['#', 'Player', ...data.pars.map((p, i) => i + 1), 'Total', '+/-', 'Hc', 'bHc', 'hcTot', 'Hc+/-'];
    const playersData = sortedScorecards.map((sc, i) => {
        const scoret: (number | string)[] = [...sc.scores];
        // Tehdään tekemättömistä väylistä tyhjiä...
        for (let i = 0; i < data.holes; i++) {
            if (!scoret[i]) scoret[i] = ' ';
        }
        const hc = (sc.median10 > 0) ? sc.median10 - data.par : 0;
        return [i + 1,
        sc.user.name,
        ...scoret,
        sc.total || '?',
        sc.plusminus,
        hc,
        (sc.beers/2),
        (sc.total || 0) - (sc.beers/2) - (hc),
        (sc.total) ? (sc.total - (sc.beers/2) - hc - data.par) : '?',
        ];
    });
    const leveydet = [20, 80, ...data.pars.map(() => 30), 50, 50, 50, 50, 50, 50];
    return (
        <ScrollView horizontal>
            <Container>
                <Table>
                    <Row data={tableHeaders} style={tyylit.header} textStyle={tyylit.headerText} widthArr={leveydet} />
                    <Rows data={playersData} textStyle={tyylit.text} style={tyylit.rivit} widthArr={leveydet} />
                </Table>
            </Container>
        </ScrollView>
    );
};
const tyylit = StyleSheet.create({
    header: {
        backgroundColor: 'rgb(90,200,90)',
    },
    headerText: {
        textAlign: 'center',
        paddingVertical: 5,
        fontWeight: 'bold',
        fontSize: 16,
    },
    text: {
        textAlign: 'center',
        paddingVertical: 5,
    },
    rivit: {
        borderBottomWidth: 1,
        borderColor: 'lightgray'
    }
});
export default Summary;
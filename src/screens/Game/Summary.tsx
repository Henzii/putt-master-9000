import React from 'react';
import { ScrollView, StyleSheet, View } from "react-native";
import { useSelector } from 'react-redux';
import useGame, { Scorecard } from '../../hooks/useGame';
import { gameData } from '../../reducers/gameDataReducer';
import { RootState } from '../../utils/store';
import Container from '../../components/ThemedComponents/Container';
import { Table, Row, Cell, TableWrapper, Rows } from 'react-native-table-component';
import Loading from '../../components/Loading';

const Summary = () => {
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    const { data, ready } = useGame(gameData.gameId);
    if (!ready || !data) {
        return (
            <Loading />
        );
    }
    const sortedScorecards = [...data.scorecards].sort((a, b) => (a.total || 0) - (b.total || 0));
    const tableHeaders = [...data.pars.map((p, i) => i + 1), 'Total', '+/-', 'Hc', 'bHc', 'hcTot', 'Hc+/-'];
    const leveydet = [...data.pars.map(() => 31), 50, 50, 50, 50, 50, 50];
    const nimetJaSijoitukset = sortedScorecards.reduce((p:Array<Array<string>>, c, i) => {
        p.push([(i+1)+'.', c.user.name]);
        return p;
    }, []);
    return (
        <Container noPadding style={{ flexDirection: 'row' }}>
            <View style={{ width: 110 }}>
                <Table>
                    <Row data={['#', 'Player']} widthArr={[30, 80]} style={[tyylit.header]} textStyle={tyylit.headerText} />
                    <Rows data={nimetJaSijoitukset} widthArr={[30,80]} textStyle={[tyylit.text, tyylit.scoreCell]} style={[tyylit.rivi]}  />
                </Table>
            </View>
            <ScrollView horizontal>
                <Table>
                    <Row data={tableHeaders} style={tyylit.header} textStyle={[tyylit.headerText]} widthArr={leveydet} />
                    {sortedScorecards.map((sc) => (
                        <SinglePlayerDataRow
                            key={sc.user.id + 'scData'}
                            pars={data.pars}
                            scorecard={sc} />)
                    )}
                </Table>
            </ScrollView>
        </Container>
    );
};
const SinglePlayerDataRow = ({ scorecard, pars }: { scorecard: Scorecard, pars: number[] }) => {
    const pickColor = (par: number, score: number) => {
        switch (par - score) {
            case 0:
                return tyylit.par;
            case 1:
                return tyylit.birdie;
            case -1:
                return tyylit.bogie;
            default:
                if ((par - score < -1)) return tyylit.doubleBogie;
                else if (par - score > 1) return tyylit.eagle;
        }
    };
    const dataCells = pars.map((p, i) => {
        return (<Cell
            key={scorecard.user.name + i + 'score'}
            data={scorecard.scores[i] || ' '}
            textStyle={tyylit.text}
            style={[tyylit.scoreBall, tyylit.scoreCell, pickColor(p, scorecard.scores[i])]}
            width={29}
        />);
    });
    return (
        <TableWrapper style={tyylit.rivi}>
            {dataCells}
            <Cell data={scorecard.total} width={50} textStyle={tyylit.text} />
            <Cell data={scorecard.plusminus} width={50} textStyle={tyylit.text} />
            <Cell data={scorecard.hc} width={50} textStyle={tyylit.text} />
            <Cell data={scorecard.beers / 2} width={50} textStyle={tyylit.text} />
            <Cell data={((scorecard.total || 0) - scorecard.hc - scorecard.beers / 2)} width={50} textStyle={tyylit.text} />
            <Cell data={(scorecard.plusminus || 0) - scorecard.hc - scorecard.beers / 2} width={50} textStyle={tyylit.text} />
        </TableWrapper>
    );
};
const tyylit = StyleSheet.create({
    scoreCell: {
        borderRadius: 30,
        //marginTop: 2,
        marginVertical: 6,
        marginLeft: 2,
    },
    scoreBall: {
        elevation: 2,
    },
    doubleBogie: {
        backgroundColor: '#fcbc9a',
    },
    bogie: {
        backgroundColor: '#fce79a',
    },
    eagle: {
        backgroundColor: 'rgb(255,207,64)'
    },
    birdie: {
        backgroundColor: '#aadaf2',
    },
    par: {
        backgroundColor: '#a5d4c3'
    },
    rivi: {
        flexDirection: 'row',
        borderColor: '#50857233',
        borderBottomWidth: 1,
    },
    header: {
        backgroundColor: 'rgb(90,200,90)',
    },
    headerText: {
        textAlign: 'center',
        paddingVertical: 7,
        fontWeight: 'bold',
        fontSize: 15,
        paddingLeft: 2,
    },
    text: {
        textAlign: 'center',
        paddingVertical: 5,
    },
});
export default Summary;
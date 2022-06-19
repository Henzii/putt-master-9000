import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, Share as NativeShare } from "react-native";
import { useSelector } from 'react-redux';
import useGame, { Scorecard } from '../../hooks/useGame';
import { gameData } from '../../reducers/gameDataReducer';
import { RootState } from '../../utils/store';
import { Table, Row, Cell, TableWrapper, Rows } from 'react-native-table-component';
import Loading from '../../components/Loading';
import { Button, Headline, Subheading } from 'react-native-paper';
import SplitContainer from '../../components/ThemedComponents/SplitContainer';
import { format, fromUnixTime } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

const Summary = () => {
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    const { data, ready } = useGame(gameData.gameId);
    const [hideBeers, setHideBeers] = useState(true);
    const [captureScreen, setCaptureScreen] = useState(false);

    const viewRef = useRef<View>(null);
    useEffect(() => {
        AsyncStorage.getItem('hideBeers').then((res) => {
            if (res === 'false') {
                setHideBeers(false);
            }
        });
    }, []);
    useEffect(() => {
        if (captureScreen) {
            handleShareScorecard();
            setCaptureScreen(false);
        }
    }, [captureScreen]);
    if (!ready || !data) {
        return (
            <Loading />
        );
    }
    const handleShareScorecard = async () => {
        try {
            if (!viewRef.current) return;
            const uri = await captureRef(viewRef);
            Sharing.shareAsync(uri);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log('error', e);
        }
    };
    const handleShareScorecardLink = () => {
        try {
            NativeShare.share({
                message: `FuDisc link: https://fudisc.henzi.fi/live/${data.id} - Link is available for 24 hours.`,
                title: 'FuDisc'
            });
            if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.log(`https://fudisc.henzi.fi/live/${data.id}`);
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log('Error', e);
        }
    };

    const sortedScorecards = [...data.scorecards].sort((a, b) => (a.total || 0) - (b.total || 0));
    const tableHeaders = [...data.pars.map((p, i) => i + 1), 'Total', '+/-', 'Hc', 'hcTot', 'Hc+/-'];
    const leveydet = [...data.pars.map(() => 31), 50, 50, 50, 50, 50];
    const nimetJaSijoitukset = sortedScorecards.reduce((p: Array<Array<string>>, c, i) => {
        p.push([(i + 1) + '.', c.user.name]);
        return p;
    }, []);
    const startTime = fromUnixTime(data.startTime / 1000);
    const formattedStartTime = format(startTime, 'dd.MM.yyyy HH:mm');

    // Lisätään tarvittaessa otsikoihin bHc
    if (!hideBeers) {
        tableHeaders.splice(tableHeaders.length - 2, 0, 'bHc');
        leveydet.push(50);
    }
    return (
        <ScrollView horizontal={(captureScreen ? true : false )}>
            <View ref={viewRef} style={[tyylit.main, (captureScreen ? { height: (120 + data.scorecards.length*45) } : null)]}>
                <View style={tyylit.topInfo}>
                    <Headline >{data.course}</Headline>
                    <SplitContainer>
                        <Subheading>{data.layout}</Subheading>
                        <Subheading>{formattedStartTime}</Subheading>
                    </SplitContainer>
                </View>
                <ScrollView contentContainerStyle={tyylit.dataTable}>
                    <View style={{ width: 110 }}>
                        <Table>
                            <Row data={['#', 'Player']} widthArr={[30, 80]} style={[tyylit.header]} textStyle={tyylit.headerText} />
                            <Rows data={nimetJaSijoitukset} widthArr={[30, 80]} textStyle={[tyylit.text, tyylit.scoreCell]} style={[tyylit.rivi]} />
                        </Table>
                    </View>
                    <ScrollView horizontal>
                        <Table>
                            <Row data={tableHeaders} style={tyylit.header} textStyle={[tyylit.headerText]} widthArr={leveydet} />
                            {sortedScorecards.map((sc) => (
                                <SinglePlayerDataRow
                                    key={sc.user.id + 'scData'}
                                    pars={data.pars}
                                    hideBeers={hideBeers}
                                    scorecard={sc} />)
                            )}
                        </Table>
                    </ScrollView>
                </ScrollView>
                {!captureScreen &&
                    <>
                        <Button icon="share-variant" onPress={() => setCaptureScreen(true)}>Share image</Button>
                        <Button icon="web" onPress={handleShareScorecardLink}>Share link</Button>
                    </>
                }
            </View>
            <View style={{ height: 100 }} />
        </ScrollView>
    );
};
const SinglePlayerDataRow = ({ scorecard, pars, hideBeers = true }: { scorecard: Scorecard, pars: number[], hideBeers?: boolean }) => {
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
    const bHc = hideBeers ? 0 : scorecard.beers / 2;
    return (
        <TableWrapper style={tyylit.rivi}>
            {dataCells}
            <Cell data={scorecard.total} width={50} textStyle={tyylit.text} />
            <Cell data={scorecard.plusminus} width={50} textStyle={tyylit.text} />
            <Cell data={scorecard.hc} width={50} textStyle={tyylit.text} />
            {!hideBeers ? <Cell data={bHc} width={50} textStyle={tyylit.text} /> : <></>}
            <Cell data={((scorecard.total || 0) - scorecard.hc - bHc)} width={50} textStyle={tyylit.text} />
            <Cell data={(scorecard.plusminus || 0) - scorecard.hc - bHc} width={50} textStyle={tyylit.text} />
        </TableWrapper>
    );
};
const tyylit = StyleSheet.create({
    main: {
        backgroundColor: 'white',
        flex: 1,
    },
    dataTable: {
        flexDirection: 'row',
        padding: 0,
        flex: 0,
        marginBottom: 20,
    },
    topInfo: {
        padding: 5,
        paddingRight: 7,
        borderBottomWidth: 1,
        borderColor: 'darkgreen',
        backgroundColor: '#efffef',
        marginTop: 0,
    },
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
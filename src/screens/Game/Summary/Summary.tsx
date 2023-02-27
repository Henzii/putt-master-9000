import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, Share as NativeShare } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import useGame from '../../../hooks/useGame';
import { gameData } from '../../../reducers/gameDataReducer';
import { RootState } from '../../../utils/store';
import Loading from '../../../components/Loading';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useSettings } from '../../../components/LocalSettingsProvider';
import TableNames from './TableNames';
import TableScores from './TableScores';
import Container from '../../../components/ThemedComponents/Container';
import { Button, Headline } from 'react-native-paper';
import { parseDate } from '../../../utils/dates';
import { addNotification } from '../../../reducers/notificationReducer';

const Summary = () => {
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    const dispatch = useDispatch();
    const { data, ready, closeGame, isFinished } = useGame(gameData.gameId);
    const [captureScreen, setCaptureScreen] = useState(false);
    const settings = useSettings();

    const viewRef = useRef<View>(null);

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
    const handleCloseGame = async () => {
        await closeGame();
        dispatch(addNotification('Game closed', 'info'));
    };
    const sortedScorecards = [...data.scorecards].sort((a, b) => {
        if (!a.total || !b.total) return 0;
        if (settings.getBoolValue('SortHC')) {
            return (a.total - a.hc) - (b.total - b.hc);
        }
        return (a.total || 0) - (b.total || 0);
    });
    return (
        <ScrollView>
            <View>
                <Headline style={tyylit.title}>{data.course}</Headline>
                <Headline style={tyylit.subTitle}>{data.layout}</Headline>
                <View style={tyylit.container}>
                    <TableNames scorecards={sortedScorecards} />
                    <ScrollView horizontal>
                        <TableScores scorecards={sortedScorecards} pars={data.pars} showBeers={!settings.getBoolValue('Prohibition')} />
                    </ScrollView>
                </View>
                <Headline style={tyylit.date}>{parseDate(data.startTime)}</Headline>
            </View>
            <Container fullHeight>
                <Button icon={'share-variant'} onPress={() => setCaptureScreen(true)}>Share image</Button>
                <Button icon={'web'} onPress={handleShareScorecardLink}>Share link</Button>
                {isFinished() && data.isOpen ? <Button mode='contained' style={{marginTop: 15}} onPress={handleCloseGame}>Close game</Button> : null}

            </Container>
        </ScrollView>
    );
};

const tyylit = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
    },
    header: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    title: {
        paddingLeft: 20,
    },
    subTitle: {
        fontSize: 15,
        paddingLeft: 20,
        marginTop: -10,
        color: 'gray'
    },
    date: {
        paddingLeft: 20,
        fontSize: 14,
        color: 'gray'
    }
});
export default Summary;
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
import { Chip, Text, useTheme } from 'react-native-paper';
import { parseDate } from '../../../utils/dates';
import { addNotification } from '../../../reducers/notificationReducer';
import Button from '@components/ThemedComponents/Button';

const Summary = () => {
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    const dispatch = useDispatch();
    const { data, ready, closeGame, isFinished } = useGame(gameData.gameId);
    const [captureScreen, setCaptureScreen] = useState(false);
    const settings = useSettings();
    const { colors } = useTheme();

    const viewRef = useRef<View>(null);

    useEffect(() => {
        if (captureScreen) {
            handleShareScorecard().finally(() => {
                setCaptureScreen(false);
            });
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

    const showBeers = !settings.getBoolValue('Prohibition');

    const sortedScorecards = [...data.scorecards].sort((a, b) => {
        if (!a.total || !b.total) return 0;
        if (settings.getBoolValue('SortHC')) {
             return (a.total - a.hc - a.beers * 0.5 * data.bHcMultiplier) - (b.total - b.hc - b.beers * 0.5 * data.bHcMultiplier);
        }
        return (a.total || 0) - (b.total || 0);
    });

    return (
        <ScrollView>
            <View>
                <ScreenCaptureWrapper withoutScrollView={!captureScreen}>
                    <View ref={viewRef} collapsable={false} style={[captureScreen && tyylit.captureContainer, { backgroundColor: colors.background }]}>
                        <Text variant="headlineSmall" style={tyylit.title}>{data.course}</Text>
                        <Text variant="titleMedium" style={[tyylit.subTitle, { color: colors.onSurfaceVariant }]}>{data.layout}</Text>
                        <View style={tyylit.container}>
                            <TableNames scorecards={sortedScorecards} />
                            <ScreenCaptureWrapper withoutScrollView={captureScreen}>
                                <TableScores scorecards={sortedScorecards} pars={data.pars} showBeers={showBeers} bHcMultiplier={data.bHcMultiplier} />
                            </ScreenCaptureWrapper>
                        </View>
                        <Text variant="bodyMedium" style={[tyylit.date, { color: colors.onSurfaceVariant }]}>{parseDate(data.startTime)}</Text>
                    </View>
                </ScreenCaptureWrapper>
            </View>
            <View style={tyylit.gameChips}>
            {data.groupName && <Chip icon="account-group">{data.groupName}</Chip>}
            {data.bHcMultiplier !== 1 && <Chip icon="beer"> {data.bHcMultiplier}x bHc</Chip>}
            </View>
            <Container fullHeight style={{gap: 10}}>
                <Button variant="secondary" icon={'share-variant'} onPress={() => setCaptureScreen(true)}>Share image</Button>
                <Button variant="secondary" icon={'web'} onPress={handleShareScorecardLink}>Share link</Button>
                {isFinished() && data.isOpen ? <Button style={{marginTop: 15}} onPress={handleCloseGame}>Close game</Button> : null}

            </Container>
        </ScrollView>
    );
};

type ScreenCaptureWrapperProps = {
    withoutScrollView: boolean
    children: React.ReactNode
}

const ScreenCaptureWrapper = (props: ScreenCaptureWrapperProps) =>
    props.withoutScrollView ? <View>{props.children}</View> : <ScrollView horizontal>{props.children}</ScrollView>;

const tyylit = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
    },
    gameChips: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        gap: 5
    },
    captureContainer: {
        flex: 1,
        paddingRight: 80,
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
        paddingLeft: 20,
        marginTop: -10,
    },
    date: {
        paddingLeft: 20,
    }
});
export default Summary;
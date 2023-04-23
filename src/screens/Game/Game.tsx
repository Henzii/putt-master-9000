import { View, Text, StyleSheet, FlatList, AppState } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import Player from './Player';
import { Dimensions } from 'react-native';
import RoundTabs from '../../components/RoundTabs';
import useGame, { Scorecard } from '../../hooks/useGame';
import Container from '../../components/ThemedComponents/Container';
import { Button, Title } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { gameData, unloadGame } from '../../reducers/gameDataReducer';
import Loading from '../../components/Loading';
import { RootState } from '../../utils/store';
import ErrorScreen from '../../components/ErrorScreen';
import { useSettings } from '../../components/LocalSettingsProvider';
import useStats from '../../hooks/useStats';

export default function Game() {
    const [selectedRound, setSelectedRound] = useState(0);
    const [scorecards, setScorecards] = useState<Scorecard[]>([]);
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    const gameId = gameData.gameId;
    const { data, loading, error, setScore } = useGame(gameId, gameData.noSubscription);
    const localSettings = useSettings();
    const stats = useStats(data?.layout_id, data?.scorecards?.map(sc => sc.user.id as string) || []);

    const handleScoreChange = (playerId: string, selectedRound: number, value: number) => {
        setScore({
            gameId,
            playerId,
            hole: selectedRound,
            value,
        });
    };

    const sortAndSetScorecards = () => {
        if (!data?.scorecards) return;
        // Kopioidaan tuloskortit
        const cards = [...data?.scorecards || []];
        for (let i = 0; i < selectedRound; i++) {
            cards.sort((a, b) => (a.scores[i] || 99) - (b.scores[i] || 99));
        }
        const throwingOrder = cards.reduce((p,c,i) => {
            p[c.user.id] = (i+1);
            return p;
        }, ({} as { [key: string]: number }));

        const scs = JSON.parse(JSON.stringify(data.scorecards)) as Scorecard[];
        scs.sort((a,b) => throwingOrder[a.user.id] - throwingOrder[b.user.id]);
        setScorecards(scs);
    };
    const goToFirstIncompleteHole = () => {
        if (!data?.scorecards) return;
        for (let i = 0; i < (data?.holes || 0); i++) {
            for (const card of data.scorecards) {
                if (isNaN(card.scores[i])) {
                    setSelectedRound(i);
                    return;
                }
            }
        }
    };
    const handleAppStateChange = (nextAppState: string) => {
        if (nextAppState === 'active') {
            goToFirstIncompleteHole();
        }
    };

    useLayoutEffect(() => {
        if(localSettings?.getBoolValue('SortBox')) sortAndSetScorecards();
    }, [selectedRound]);

    useEffect(() => {
        if (data?.scorecards) {
            if (localSettings?.getBoolValue('SortBox')) {
                sortAndSetScorecards();
            } else {
                setScorecards(data.scorecards);
            }
        }

        if (localSettings?.getBoolValue('AutoAdvance')) {
            const sub = AppState.addEventListener('change', handleAppStateChange);
            return () => sub.remove();
        }
    }, [localSettings, data]);

    useEffect(() => {
        goToFirstIncompleteHole();
    }, []);

    if (!data && loading) return <Loading />;
    if (!data || error) {
        return <ErrorScreen errorMessage={`Error just happened!`} />;
    }
    if (!data.isOpen) {
        return <ClosedGame />;
    }
    // Apumuuttuja jolla todetaan swiippaus vasemmalle
    let touchPos = [0, 0];
    return (
        <>
            <RoundTabs gameData={data} selectedRound={selectedRound} setSelectedRound={setSelectedRound} />
            <Container noPadding>
                <View
                    style={{ minHeight: '100%' }}
                    onTouchStart={(e) => touchPos = [e.nativeEvent.pageX, e.nativeEvent.pageY]}
                    onTouchEnd={(e) => {
                        // 50 % ruudun leveydesä
                        const width50 = Dimensions.get('screen').width * 0.5;
                        // Jos kosketus on Y-suunnassa yli 30 -> return
                        if (Math.abs(e.nativeEvent.pageY - touchPos[1]) >= 50) return;

                        const movement = e.nativeEvent.pageX - touchPos[0];
                        // Jos liike X-suunnassa on vähemmän kuin 70% leveydestä
                        if (Math.abs(movement) < width50) return;

                        if (movement > 0 && selectedRound > 0) setSelectedRound((v) => v - 1);
                        else if (movement < 0 && selectedRound < data.holes - 1) setSelectedRound((v) => v + 1);
                    }}
                >
                    <View
                        style={peliStyles.headers}
                    >
                        <Text testID="GameRata" style={peliStyles.course}>{data.course} #{selectedRound + 1}, par {data.pars[selectedRound]}</Text>
                        <Text testID="GameLayout" style={peliStyles.layout}>{data.layout}</Text>
                    </View>
                    <FlatList
                        style={{ flex: 1 }}
                        data={scorecards}
                        keyExtractor={(item) => item.user.id as string}
                        ListFooterComponent={<View style={{ height: 70 }} />}
                        ItemSeparatorComponent={SeparatorComp}
                        renderItem={({ item }) => (
                            <Player
                                player={item}
                                stats={stats}
                                selectedRound={selectedRound}
                                setScore={handleScoreChange}
                            />
                        )}
                    />
                </View>
            </Container>
        </>
    );
}
const SeparatorComp = () => {
    return <View style={{ height: 6 }} />;
};
const ClosedGame = () => {
    const dispatch = useDispatch();

    // Uusi peli -> poistetaan pelin tiedot redux-storesta jolloin createGame näkymä avautuu
    const handleButtonClick = () => {
        dispatch(unloadGame());
    };
    return (
        <Container style={peliStyles.gameover}>
            <Title style={peliStyles.gameoverText}>Game over!</Title>
            <Button onPress={handleButtonClick}>Start a new game</Button>
        </Container>
    );
};
const peliStyles = StyleSheet.create({
    headers: {
        padding: 10,
    },
    gameover: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    gameoverText: {
        color: 'gray',
        fontSize: 30,
    },
    course: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    layout: {
        color: 'gray',
    }
});
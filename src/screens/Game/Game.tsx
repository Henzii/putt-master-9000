import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, { useState } from 'react';
import Player from './Player';
import { Dimensions } from 'react-native';
import RoundTabs from '../../components/RoundTabs';
import useGame from '../../hooks/useGame';
import Container from '../../components/ThemedComponents/Container';
import { Button, Title } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { gameData, unloadGame } from '../../reducers/gameDataReducer';
import Loading from '../../components/Loading';
import { RootState } from '../../utils/store';
import ErrorScreen from '../../components/ErrorScreen';
import { useCallback } from 'react';

export default function Game() {
    const [selectedRound, setSelectedRound] = useState(0);
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    const gameId = gameData.gameId;
    const { data, loading, error, setScore } = useGame(gameId);

    const handleScoreChange = (playerId: string, selectedRound: number, value: number) => {
        setScore({
            gameId,
            playerId,
            hole: selectedRound,
            value,
        });
    };
    const findThrowingOrder = useCallback(() => {
        // Kopioidaan tuloskortit
        const cards = [...data?.scorecards || []];
        for (let i = 1; i < selectedRound; i++) {
            cards.sort((a, b) => (a.scores[i] || 99) - (b.scores[i] || 99));
        }
        return cards.reduce((p,c,i) => {
            p[c.user.id] = (i+1);
            return p;
        }, ({} as { [key: string]: number }));
    }, [selectedRound]);

    if (!data && loading) return <Loading />;
    if (!data || error) {
        return <ErrorScreen errorMessage={`Error just happened!`} />;
    }
    if (!data.isOpen) {
        return <ClosedGame />;
    }
    // Apumuuttuja jolla todetaan swiippaus vasemmalle
    let touchPos = [0, 0];
    const throwingOrder = findThrowingOrder();
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
                        data={data.scorecards}
                        keyExtractor={(item) => item.user.id as string}
                        ListFooterComponent={<View style={{ height: 100 }} />}
                        renderItem={({ item }) => (
                            <Player
                                player={item}
                                selectedRound={selectedRound}
                                setScore={handleScoreChange}
                                order={throwingOrder[item.user.id]}
                            />
                        )}
                    />
                </View>
            </Container>
        </>
    );
}
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
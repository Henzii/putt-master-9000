import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../utils/store';
import { gameData } from '../../../reducers/gameDataReducer';
import useGame from '../../../hooks/useGame';
import { Button, Checkbox, DataTable, Title } from 'react-native-paper';
import Container from '../../../components/ThemedComponents/Container';
import RandomItem from './RandomItem';
import { DISCS, THROW_STYLES } from '../../../constants/constants';
import Spacer from '../../../components/ThemedComponents/Spacer';
import { Audio } from 'expo-av';
import { Text, Pressable, StyleSheet } from 'react-native';

const RANDOMIZER_TIME = 15;

const ThrowStyle = () => {
    const gameId = (useSelector((state: RootState) => state.gameData) as gameData).gameId;
    const [isRunning, setIsRunning] = useState(false);
    const [individualThrowStyles, setIndividualThrowStyles] = useState(true);
    const [tuplausMusic, setTuplausMusic] = useState<Audio.Sound>();
    const ref = useRef<NodeJS.Timeout>();
    const [timeLeft, setTimeLeft] = useState(RANDOMIZER_TIME);
    const game = useGame(gameId);

    const handleStartClick = async () => {
        setIsRunning(true);
        setTimeLeft(RANDOMIZER_TIME);
        ref.current = setInterval(() => setTimeLeft(value => value - 1), 1000);
        tuplausMusic?.playAsync();
    };

    const handleStopRunning = () => {
        setIsRunning(false);
        clearInterval(ref.current);
        tuplausMusic?.stopAsync();
    };

    useEffect(() => {
        const loadSound = async () => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { sound } = await Audio.Sound.createAsync(require('../../../../assets/sounds/tuplaus.mp3'));
            setTuplausMusic(sound);
        };
        loadSound();
    }, []);

    useEffect(() => {
        return () => {
            tuplausMusic?.stopAsync();
        };
    }, [tuplausMusic]);

    useEffect(() => {
        if (timeLeft <= 0 && isRunning) {
            handleStopRunning();
        }
    }, [timeLeft]);

    return (
        <Container>
            <Title>Randomize throw styles</Title>
            <Pressable style={{ flexDirection: 'row', paddingRight: 10, alignItems: 'center', marginVertical: 8 }} onPress={() => setIndividualThrowStyles(value => !value)}>
                <Checkbox status={individualThrowStyles ? 'checked' : 'unchecked'} />
                <Text numberOfLines={2}>Assign a throw style to each player individually.</Text>
            </Pressable>
            {individualThrowStyles ? (
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Player</DataTable.Title>
                        <DataTable.Title>Disc</DataTable.Title>
                        <DataTable.Title>Style</DataTable.Title>
                    </DataTable.Header>
                    {game.data?.scorecards.map(sc =>
                        <DataTable.Row key={sc.user.id}>
                            <DataTable.Cell>{sc.user.name}</DataTable.Cell>
                            <DataTable.Cell><RandomItem items={DISCS} isRunning={isRunning} /></DataTable.Cell>
                            <DataTable.Cell><RandomItem items={THROW_STYLES} isRunning={isRunning} /></DataTable.Cell>
                        </DataTable.Row>
                    )}
                </DataTable>
            ) : (
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title textStyle={styles.largeText}>
                            Disc
                        </DataTable.Title>
                        <DataTable.Title textStyle={styles.largeText}>
                            Style
                        </DataTable.Title>
                    </DataTable.Header>
                    <DataTable.Row>
                        <DataTable.Cell>
                            <RandomItem items={DISCS} isRunning={isRunning} style={[styles.mediumText]} />

                        </DataTable.Cell>
                        <DataTable.Cell>
                            <RandomItem items={THROW_STYLES} isRunning={isRunning} style={styles.mediumText} />
                        </DataTable.Cell>
                    </DataTable.Row>
                </DataTable>
            )}
            <Spacer />
            <Button mode="contained" onPress={handleStartClick} disabled={isRunning}>{isRunning ? `${timeLeft}...` : 'Start randomizing'}</Button>
            {isRunning && (
                <>
                    <Spacer />
                    <Button mode="contained-tonal" onPress={handleStopRunning}>Shut the fuck up!</Button>
                </>
            )}
        </Container>
    );
};

const styles = StyleSheet.create({
    largeText: {
        fontSize: 20
    },
    mediumText: {
        fontSize: 18,
        fontWeight: '600'
    }
});

export default ThrowStyle;
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../utils/store';
import { gameData } from '../../../reducers/gameDataReducer';
import useGame from '../../../hooks/useGame';
import { Button, DataTable, Title } from 'react-native-paper';
import Container from '../../../components/ThemedComponents/Container';
import RandomItem from './RandomItem';
import { DISCS, THROW_STYLES } from './constants';
import Spacer from '../../../components/ThemedComponents/Spacer';

const RANDOMIZER_TIME = 5;

const ThrowStyle = () => {
    const gameId = (useSelector((state: RootState) => state.gameData) as gameData).gameId;
    const [isRunning, setIsRunning] = useState(false);
    const ref = useRef<NodeJS.Timeout>();
    const [timeLeft, setTimeLeft] = useState(RANDOMIZER_TIME);
    const game = useGame(gameId);

    const handleStartClick = () => {
        setIsRunning(true);
        setTimeLeft(RANDOMIZER_TIME);
        ref.current = setInterval(() => setTimeLeft(value => value - 1), 1000);
    };

    useEffect(() => {
        if (timeLeft <= 0 && isRunning) {
            setIsRunning(false);
            clearInterval(ref.current);
        }
    }, [timeLeft]);

    return (
        <Container>
            <Title>Randomize throw styles</Title>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Player</DataTable.Title>
                    <DataTable.Title>Disc</DataTable.Title>
                    <DataTable.Title>Style</DataTable.Title>
                </DataTable.Header>
                    {game.data?.scorecards.map(sc =>
                    <DataTable.Row  key={sc.user.id}>
                        <DataTable.Cell>{sc.user.name}</DataTable.Cell>
                        <DataTable.Cell><RandomItem items={DISCS} isRunning={isRunning} /></DataTable.Cell>
                        <DataTable.Cell><RandomItem items={THROW_STYLES} isRunning={isRunning} /></DataTable.Cell>
                    </DataTable.Row>
                    )}
            </DataTable>
            <Spacer />
            <Button mode="contained-tonal" onPress={handleStartClick} disabled={isRunning}>{isRunning ? `${timeLeft}...` : 'Start randomizing'}</Button>
        </Container>
    );
};

export default ThrowStyle;
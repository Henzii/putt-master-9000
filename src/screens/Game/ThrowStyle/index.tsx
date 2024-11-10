import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../utils/store';
import { gameData } from '../../../reducers/gameDataReducer';
import useGame from '../../../hooks/useGame';
import { Button, DataTable, Headline } from 'react-native-paper';
import Container from '../../../components/ThemedComponents/Container';
import RandomDisc from './RandomItem';
import { DISCS, THROW_STYLES } from './constants';

const ThrowStyle = () => {
    const gameId = (useSelector((state: RootState) => state.gameData) as gameData).gameId;
    const [isRunning, setIsRunning] = useState(false);
    const game = useGame(gameId);

    const handleStartClick = () => {
        setIsRunning(true);
        setTimeout(() => setIsRunning(false), 5000);
    };

    return (
        <Container>
            <Headline>Randomize shits</Headline>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Cell>Player</DataTable.Cell>
                    <DataTable.Cell>Disc</DataTable.Cell>
                    <DataTable.Cell>Style</DataTable.Cell>
                </DataTable.Header>
                    {game.data?.scorecards.map(sc =>
                    <DataTable.Row  key={sc.user.id}>
                        <DataTable.Cell>{sc.user.name}</DataTable.Cell>
                        <DataTable.Cell><RandomDisc items={DISCS} isRunning={isRunning} /></DataTable.Cell>
                        <DataTable.Cell><RandomDisc items={THROW_STYLES} isRunning={isRunning} /></DataTable.Cell>
                    </DataTable.Row>
                    )}
            </DataTable>
            <Button mode="contained-tonal" onPress={handleStartClick} disabled={isRunning}>Start randomizing</Button>
        </Container>
    );
};

export default ThrowStyle;
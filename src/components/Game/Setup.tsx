import React from 'react';
import { Alert, StyleSheet } from "react-native";
import { Button, Divider, Paragraph, TextInput, Title } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../utils/store';
import { gameData, unloadGame } from '../../reducers/gameDataReducer';
import Container from '../ThemedComponents/Container';
import useGame from '../../hooks/useGame';
import { addNotification } from '../../reducers/notificationReducer';
import useTextInput from '../../hooks/useTextInput';
import { useNavigate } from 'react-router-native';
import Loading from '../Loading';

const Setup = () => {
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    const dispatch = useDispatch();
    const navi = useNavigate();
    const gameHook = useGame(gameData.gameId);
    const [beerInput] = useTextInput({
        numeric: true,
        callBack: async (value) => {
            const beers = Number.parseInt(value) || 0;
            if (isNaN(beers) || !await gameHook.setBeers(beers)) {
                dispatch(addNotification('Beers not drank for some reason!', 'alert'));
            }
        },
        callBackDelay: 1000,
        defaultValue: gameHook.data?.myScorecard.beers.toString() || '',
    });
    const game = gameHook.data;
    const handleGameEnd = async () => {
        Alert.alert(
            'Are you sure?',
            'After closing the game you will no longer be able to enter scores or drink beer',
            [
                {
                    text: 'Cancel',
                    onPress: () => null
                },
                {
                    text: 'Do it!',
                    onPress: async () => {
                        if (await gameHook.closeGame()) {
                            dispatch(addNotification('Game closed', 'success'));
                        } else {
                            dispatch(addNotification('Something went wrong :(', 'alert'));
                        }
                    }
                },
            ]
        );
    };
    const handleQuitGame = () => {
        navi('/');
        dispatch(unloadGame());
    };
    const handleAbandonGame = () => {
        Alert.alert(
            'Are you sure',
            'Everything will be deleted',
            [
                {
                    text: 'Cancel',
                    onPress:() => null
                },
                {
                    text: 'Yes!',
                    onPress: () => null
                },
            ]
        );
    };
    if (!game) {
        return (<Loading />);
    }
    return (
        <Container>
            <Title>Beers</Title>
            <Paragraph>
                Number of beers drunk
            </Paragraph>
            <TextInput
                autoComplete={false}
                style={tyyli.numberInput}
                label='# beers'
                disabled={!gameHook.data?.isOpen}
                {...beerInput}
            />
            <Divider style={tyyli.divider} />
            <Paragraph>
                Stop drinking and end the game.
            </Paragraph>
            <Button
                mode='contained'
                style={tyyli.nappi}
                onPress={handleGameEnd}
                disabled={!game.isOpen}
            >End game
            </Button>
            <Divider style={tyyli.divider} />
            <Paragraph>
               Quit game{(gameHook.data?.isOpen) ? ', leave the game open':''}. Praise the lord!
            </Paragraph>
            <Button
                onPress={handleQuitGame}
                mode='contained'
                style={tyyli.nappi}
            >Quit</Button>

            <Divider style={tyyli.divider} />
            <Paragraph>
                Abandon game. Delete everything related to this game
            </Paragraph>
            <Button style={tyyli.nappi} mode='contained' color='red' onPress={handleAbandonGame}>Abandon game</Button>
            <Divider style={tyyli.divider} />
            <Paragraph style={{ color: 'gray' }}>
                Game ID: {gameData.gameId}
            </Paragraph>
        </Container>
    );
};
const tyyli = StyleSheet.create({
    divider: {
        marginTop: 15,
        marginBottom: 15,
        height: 1,
    },
    numberInput: {
        width: 100,
    },
    nappi: {
        paddingVertical: 5,
        borderRadius: 7,
    }
});
export default Setup;
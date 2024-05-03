import React from 'react';
import { Alert, StyleSheet } from "react-native";
import { Button, Paragraph, Title } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../utils/store';
import { gameData, unloadGame } from '../../reducers/gameDataReducer';
import Container from '../../components/ThemedComponents/Container';
import Divider from '../../components/ThemedComponents/Divider';
import useGame from '../../hooks/useGame';
import { addNotification } from '../../reducers/notificationReducer';
import { useNavigate } from 'react-router-native';
import Loading from '../../components/Loading';
import { useMutation } from '@apollo/client';
import { ABANDON_GAME } from '../../graphql/mutation';
import { GET_OLD_GAMES } from '../../graphql/queries';
import { format, fromUnixTime, differenceInMinutes, minutesToHours, differenceInDays } from 'date-fns';
import Spacer from '../../components/ThemedComponents/Spacer';
import LocalSettings from '../../components/LocalSettings';

const Setup = () => {
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    const dispatch = useDispatch();
    const navi = useNavigate();
    const gameHook = useGame(gameData.gameId);
    const [abandonGameMutation] = useMutation(ABANDON_GAME, { refetchQueries: [{ query: GET_OLD_GAMES }] });

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
    const handleAbandonGame = async () => {
        const res = await abandonGameMutation({ variables: { gameId: gameData.gameId } });
        if (res.data.abandonGame) {
            dispatch(unloadGame());
            dispatch(addNotification('Game abandoned', 'success'));
        } else {
            dispatch(addNotification('Something went wrong!', 'alert'));
        }
    };

    const handleQuitGame = () => {
        navi('/');
        dispatch(unloadGame());
    };
    const handleReopen = async () => {
        await gameHook.closeGame(true);
    };
    const verifyAbandonGame = () => {
        Alert.alert(
            'Are you sure',
            'Everything will be deleted',
            [
                {
                    text: 'Cancel',
                    onPress: () => null
                },
                {
                    text: 'Yes!',
                    onPress: handleAbandonGame
                },
            ]
        );
    };
    if (!game) {
        return (<Loading />);
    }
    const startDate = fromUnixTime(game.startTime / 1000);
    const endDate = (game.endTime ? fromUnixTime(game.endTime / 1000) : undefined);
    const startDateFormatted = format(startDate, 'dd.MM.yyyy HH:mm');
    const endDateFormatted = (endDate ? format(endDate, 'dd.MM.yyyy HH:mm') : '?');
    const duration = differenceInMinutes(endDate || new Date(), startDate);
    const durationString = (duration > 60)
        ? `${minutesToHours(duration)} h ${duration % 60} min`
        : `${duration} min`;
    return (
        <Container withScrollView noPadding>
            <Container verticalPadding>
                <Title>Info</Title>
                <Paragraph>Started          {startDateFormatted}</Paragraph>
                <Paragraph>Closed           {endDateFormatted}</Paragraph>
                <Paragraph>Duration        {durationString}</Paragraph>
            </Container>
            <Divider />
            {game.isOpen && (
                <>
                    <Container verticalPadding>
                        <Title>End game</Title>
                        <Paragraph>
                            Stop drinking and close the game.
                        </Paragraph>
                        <Spacer />
                        <Button
                            mode='contained'
                            style={tyyli.nappi}
                            onPress={handleGameEnd}
                            disabled={!game.isOpen}
                        >End game
                        </Button>
                    </Container>
                    <Divider />
                </>
            )}
            {!game.isOpen && differenceInDays(new Date(), endDate || new Date()) < 30 &&  (
                <>
                    <Container verticalPadding>
                        <Title>Reopen</Title>
                        <Paragraph>
                            Reopen the game. Other players will be notified of your cheating attempt.
                        </Paragraph>
                        <Spacer />
                        <Button mode="contained" buttonColor="orange" style={tyyli.nappi} onPress={handleReopen}>Reopen</Button>
                    </Container>
                    <Divider />
                </>
            )}
            <Container verticalPadding>
                <Title>Main menu</Title>
                <Paragraph>
                    Unload the game and return to main menu
                </Paragraph>
                <Spacer />
                <Button
                    onPress={handleQuitGame}
                    mode='contained'
                    style={tyyli.nappi}
                >Quit</Button>
            </Container>
            <Divider />
            <LocalSettings />
            <Divider />
            <Container verticalPadding>
                <Paragraph>
                    If the game is finished, only your scorecard will be burned in hell.
                </Paragraph>
                <Spacer />
                <Button style={tyyli.nappi} mode='contained' buttonColor='darkred' onPress={verifyAbandonGame}>Discard game</Button>
            </Container>
            <Divider />
            <Paragraph style={{ color: 'gray' }}>
                Game ID: {gameData.gameId} {gameData.noSubscription && ' / No subscription'}
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
    },
    input: {
        minWidth: 130,
        maxWidth: '50%',
    }
});
export default Setup;


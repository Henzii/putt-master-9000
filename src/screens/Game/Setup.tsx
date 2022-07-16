import React, { useState } from 'react';
import { Alert, StyleSheet, View } from "react-native";
import { Button, List, Paragraph, TextInput, Title, Menu } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../utils/store';
import { gameData, unloadGame } from '../../reducers/gameDataReducer';
import Container from '../../components/ThemedComponents/Container';
import Divider from '../../components/ThemedComponents/Divider';
import useGame from '../../hooks/useGame';
import { addNotification } from '../../reducers/notificationReducer';
import { useNavigate } from 'react-router-native';
import Loading from '../../components/Loading';
import { useMutation } from 'react-apollo';
import { ABANDON_GAME } from '../../graphql/mutation';
import { GET_OLD_GAMES } from '../../graphql/queries';
import { format, fromUnixTime, differenceInMinutes, minutesToHours } from 'date-fns';
import Spacer from '../../components/ThemedComponents/Spacer';
import SplitContainer from '../../components/ThemedComponents/SplitContainer';

const Setup = () => {
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    const dispatch = useDispatch();
    const navi = useNavigate();
    const gameHook = useGame(gameData.gameId);
    const [abandonGameMutation] = useMutation(ABANDON_GAME, { refetchQueries: [{ query: GET_OLD_GAMES }] });

    const [selectHoleMenuVisible, setSelectHoleMenuVisible] = useState(false);
    const [selectedHole, setSelectedHole] = useState<number | undefined>();
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
    const handleSelectHole = (hole: number) => {
        setSelectedHole(hole);
        setSelectHoleMenuVisible(false);
    };
    const handleChangePar = () => {
        return null;
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
                <Paragraph>Ended            {endDateFormatted}</Paragraph>
                <Paragraph>Duration        {durationString}</Paragraph>
            </Container>
            <Divider />
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
            <List.Accordion
                title="Change PAR"
            >
                <Container verticalPadding>
                    <Paragraph>
                        Change hole&apos;s par-value. Applies only to this game.
                    </Paragraph>
                    <Spacer />
                    <SplitContainer spaceAround style={{ alignContent: 'center' }}>
                        <Menu
                            visible={selectHoleMenuVisible}
                            onDismiss={() => setSelectHoleMenuVisible(false)}
                            anchor={
                                <Button
                                    onPress={() => setSelectHoleMenuVisible(true)}
                                    mode={selectedHole === undefined ? 'outlined' : 'contained'}
                                >
                                    {selectedHole === undefined ? 'Select hole' : `Hole ${selectedHole + 1}`}
                                </Button>
                            }
                        >
                            {game.pars.map((par, i) => (
                                <Menu.Item
                                    key={`${par}-${i}`}
                                    title={`Hole ${i + 1}, par ${par}`}
                                    onPress={() => handleSelectHole(i)}
                                />
                            ))}
                        </Menu>
                        {selectedHole !== undefined && (
                            <>
                                <View>
                                    <TextInput
                                        keyboardType='numeric'
                                        defaultValue={game.pars[selectedHole].toString()}
                                        autoComplete={false}
                                        label="Par"
                                        mode="outlined"
                                        style={tyyli.input} dense
                                    />
                                </View>
                                <Button color="green" mode="contained" disabled={!game.isOpen} onPress={handleChangePar}>Save</Button>
                            </>
                        )}
                    </SplitContainer>
                </Container>
            </List.Accordion>
            <Divider />
            <List.Accordion title="Discard game">
                <Container verticalPadding>
                    <Paragraph>
                        If the game is finished, only your scorecard will be burned in hell.
                    </Paragraph>
                    <Spacer />
                    <Button style={tyyli.nappi} mode='contained' color='red' onPress={verifyAbandonGame}>Discard game</Button>
                </Container>
            </List.Accordion>
            <Divider />
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
    },
    input: {
        minWidth: 130,
        maxWidth: '50%',
    }
});
export default Setup;


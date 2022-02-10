import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import { StyleSheet, Text, View } from "react-native";
import { Button, Caption, Divider, Paragraph, TextInput, Title } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { CLOSE_GAME } from '../../graphql/mutation';
import { GET_GAME } from '../../graphql/queries';
import { RootState } from '../../utils/store';
import { gameData } from '../../reducers/gameDataReducer';
import Container from '../ThemedComponents/Container';
import useGame from '../../hooks/useGame';
import { addNotification } from '../../reducers/notificationReducer';
import useTextInput from '../../hooks/useTextInput';

const Setup = () => {
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    const dispatch = useDispatch();
    const gameHook = useGame(gameData.gameId)
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
        if (await gameHook.closeGame()) {
            dispatch(addNotification('Game closed', 'success'))
        } else {
            dispatch(addNotification('Something went wrong :(', 'alert'))
        }
    }
    if (!game) {
        return (<View><Text>Loading...</Text></View>)
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
                {...beerInput}
            />
            <Divider style={tyyli.divider} />
            <Paragraph>
                End the game.
            </Paragraph>
            <Button 
                mode='contained'
                style={tyyli.nappi}
                onPress={handleGameEnd}
                disabled={!game.isOpen}
            >End game</Button>
            <Divider style={tyyli.divider} />
            <Paragraph>
                Abandon game. Delete everything related to this game
            </Paragraph>
            <Button style={tyyli.nappi} mode='contained' color='red'>Abandon game</Button>
            <Divider style={tyyli.divider} />
            <Paragraph style={{ color: 'gray' }}>
                Game ID: {gameData.gameId}
            </Paragraph>
        </Container>
    )
}
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
})
export default Setup;
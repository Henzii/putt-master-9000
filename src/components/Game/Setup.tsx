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
import useGame, { Game } from '../../hooks/useGame';
import { addNotification } from '../../reducers/notificationReducer';

const Setup = () => {
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    const [beers, setBeers] = useState<number | null>(null);
    const dispatch = useDispatch();
    const [closeGameMutation] = useMutation(CLOSE_GAME, { refetchQueries: [{ query: GET_GAME, variables: { gameId: gameData.gameId } }] })
    const {data: game} = useGame(gameData.gameId)

    const handleBeersChange = (value: string) => {
        if (value === '') setBeers(null);

        const intValue = Number.parseInt(value);
        if (isNaN(intValue)) return;
        setBeers(intValue);
    }
    const handleGameEnd = async () => {
        const res = await closeGameMutation({ variables: { gameId: gameData.gameId }});
        if (!res.data.closeGame.isOpen) {
            dispatch(addNotification('Game is now closed', 'success'))
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
                Beers drank during the round
            </Paragraph>
            <TextInput
                autoComplete={false}
                keyboardType='numeric'
                value={(beers) ? beers.toString() : ''}
                onChangeText={handleBeersChange}
                style={tyyli.numberInput}
                label='# beers'
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
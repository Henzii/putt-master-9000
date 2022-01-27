import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import { View, Text } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { ADD_PLAYERS_TO_GAME, CREATE_GAME } from '../../graphql/mutation';
import { gameData, newGame } from '../../reducers/gameDataReducer';
import { addNotification } from '../../reducers/notificationReducer';
import { RootState } from '../../utils/store';
import CreateGame, { NewGameData } from './CreateGame';
import Game from './Game';
import Peli from './Game';

export default function() {
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    const [createGameMutation] = useMutation(CREATE_GAME);
    const [addPlayersMutation] = useMutation(ADD_PLAYERS_TO_GAME);
    const dispatch = useDispatch();

    const handleCreateGame = async (data: NewGameData) => {
        if (!data.layout) return;
        const res = await createGameMutation({
            variables: { layoutId: data.layout.id }
        })
        const newGameId = res.data.createGame;
        console.log('New game:', newGameId);
        await addPlayersMutation({ variables: {
            gameId: newGameId,
            playerIds: data.players.map(p => p.id)
        }})
        dispatch(newGame(newGameId));
        dispatch(addNotification('New game created!', 'success'));
    }
    if (gameData?.gameId) { // Jos reduxissa on peliId ladattuna, näytetän pelikorttihärpäke
        return <Game gameId={gameData.gameId} />
    }
    return <CreateGame onCreate={handleCreateGame}/>
    
}


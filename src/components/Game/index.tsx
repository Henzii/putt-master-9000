import React, { useState } from 'react';
import { StyleSheet, View } from "react-native";
import { Title } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { Course } from '../../hooks/useCourses';
import { gameData } from '../../reducers/gameDataReducer';
import { RootState } from '../../utils/store';
import CreateGame, { NewGameData } from './CreateGame';
import Peli from './Peli';

export default function() {
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    const handleCreateGame = (data: NewGameData) => {
        console.log(data)
    }
    return <CreateGame onCreate={handleCreateGame}/>
    
}


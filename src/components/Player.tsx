import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import SelectButton from './SelectButton';

import { gameDataPlayer, setScore } from '../reducers/gameDataReducer';

export default function Player({ player, selectedRound }: PlayerArgs) {
    const dispatch = useDispatch()
    const handleButtonClick = (score: number) => {
        setTimeout(() => {
            dispatch(setScore(player.id, selectedRound, score))
        }, 2000);
    }
    return (
        <Card style={tyyli.main}>
            <Card.Title
                title={player.name}
            />
            <Card.Content style={tyyli.content}>
                <View style={tyyli.contentLeft}>
                    <Tulosnapit name={player.name} score={player.scores[selectedRound]} setSelected={handleButtonClick} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text>Jotain</Text>
                </View>
            </Card.Content>
        </Card>

    )

}
const Tulosnapit = ({ name, score, setSelected }: { name: string, score: number | undefined, setSelected: (i: number) => void }) => {
    const [pending, setPending] = useState<number | null>(null);
    const ret = [];
    const handleButtonClick = (btnNro: number) => {
        setPending(btnNro);
        setSelected(btnNro);
    }
    
    useEffect(() => {
        setPending(null);
    }, [score])

    for (let i = 1; i < 6; i++) ret.push(
        <SelectButton 
            selected={(i === score)}
            pending={(i === pending)}
            key={name.concat(i.toString())}
            width="10vw"
            onClick={() => handleButtonClick(i)}
            text={i + ''}
        />)

    return <>{ret}</>
}
type PlayerArgs = {
    player: gameDataPlayer,
    selectedRound: number,
}

const tyyli = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    contentLeft: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '70%'
    },
    main: {
        minHeight: 120,
        width: '100vw',
        shadowRadius: 3,
        marginBottom: 1,
        padding: 10,
    }
})

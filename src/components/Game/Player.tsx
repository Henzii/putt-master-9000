import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { ADD_PLAYERS_TO_GAME } from '../../graphql/mutation';
import { Scorecard } from '../../hooks/useGame';
import { User } from '../../hooks/useMe';
import SelectButton from '../SelectButton';

type PlayerArgs = {
    player: Scorecard,
    pars: number[],
    selectedRound: number,
    setScore: (playerId: string, selectedRound: number, value: number) => void,
}

export default function Player({ player, selectedRound, pars, setScore }: PlayerArgs) {
    const handleButtonClick = (score: number) => {
        setScore(player.user.id as string, selectedRound, score)
    }
    return (
        <Card style={tyyli.main}>
            <Card.Title
                title={player.user.name}
            />
            <Card.Content style={tyyli.content}>
                <View style={tyyli.contentLeft}>
                    <Tulosnapit name={player.user.name} score={player.scores[selectedRound]} setSelected={handleButtonClick} />
                </View>
                <View style={tyyli.contentRight}>
                    <Text style={tyyli.crText}>
                        {player.scores.reduce((p, c, i) => {
                            if (!c) return p;
                            return p + (c - pars[i])
                        }, 0)}
                    </Text>
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
            width="15%"
            onClick={() => handleButtonClick(i)}
            text={i + ''}
        />)

    return <>{ret}</>
}


const tyyli = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    contentLeft: {
        flex: 4,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '70%'
    },
    contentRight: {
        flex: 1,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    crText: {
        fontSize: 20,
    },
    main: {
        minHeight: 120,
        width: '100%',
        shadowRadius: 3,
        marginBottom: 1,
        padding: 10,
    }
})

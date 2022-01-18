import React from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet, SafeAreaView } from 'react-native'
import { gameData } from '../reducers/gameDataReducer';
import { theme } from '../utils/theme';

export default function RoundTabs({ gameData, selectedRound, setSelectedRound }: RoundTabsProps) {
    const tabsList: JSX.Element[] = [];

    for (let i = 0; i < gameData.holes; i++) {

        const finished = gameData.players.reduce(( p,c ) => {
            if (!c.scores[i]) return false;
            return p;
        }, true)

        tabsList.push(
            <SingleTab 
                key={'sc' + i}
                finished={finished}
                id={i}
                selected={(selectedRound === i)}
                onClick={setSelectedRound}
            />
        );
    }
    return (
        <View style={tabsStyle.container}>
            <ScrollView 
                horizontal
                contentContainerStyle={tabsStyle.root}
                showsHorizontalScrollIndicator={false}
            >
                {tabsList}
            </ScrollView>
        </View>
    )
}

function SingleTab({ id, selected, onClick, finished }: { finished?: boolean, id: number, selected: boolean, onClick: (n: number) => void}) {
    const tausta = (
        finished && selected ? tabsStyle.finishedAndSelected :
        selected ? tabsStyle.selected : finished ? tabsStyle.finished : null
    )
    return (
        <Pressable onPress={() => onClick(id)}>
            <View style={[tabsStyle.single, tausta]} >
                <Text style={tabsStyle.text}>{id+1}</Text>
            </View>
        </Pressable>
    )
}

type RoundTabsProps = {
    gameData: gameData,
    selectedRound: number,
    setSelectedRound: (round: number) => void,
}

const tabsStyle = StyleSheet.create({
    container: {
        width: '100%',
    },
    root: {
        display: 'flex',
        flexDirection: 'row',
    },
    text: {
        textAlign: 'center',
        fontSize: theme.font.sizes.large,
    },
    single: {
        backgroundColor: 'rgb(220,220,220)',
        borderWidth: 1,
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderColor: 'lightgray',
        paddingTop: '20%',
        width: 50,
        height: 50,
    },
    selected: {
        backgroundColor: 'white',
        borderBottomWidth: 0,
    },
    finished: {
        backgroundColor: 'rgb(180,220,180)'
    },
    finishedAndSelected: {
        borderBottomWidth: 0,
        backgroundColor: 'rgb(180, 255, 180)'
    }
})
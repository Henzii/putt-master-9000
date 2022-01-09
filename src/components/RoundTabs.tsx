import React from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet, SafeAreaView } from 'react-native'
import { gameData } from '../reducers/gameDataReducer';

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
    return (
        <Pressable onPress={() => onClick(id)}>
            <View style={[tabsStyle.single, (finished ? tabsStyle.finished : null), (selected ? tabsStyle.selected : null)]} >
                <Text>{id+1}</Text>
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
    single: {
        textAlign: 'center',
        backgroundColor: 'rgb(250,245,245)',
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
        backgroundColor: 'rgb(200,220,200)'
    }
})
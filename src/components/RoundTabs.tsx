import React from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet, SafeAreaView } from 'react-native'

export default function RoundTabs({ tabs, selectedRound, setSelectedRound }: RoundTabsProps) {
    const tabsList: JSX.Element[] = [];
    for (let i = 0; i < tabs; i++) {
        tabsList.push(
            <SingleTab 
                key={'sc' + i}
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

function SingleTab({ id, selected, onClick }: { id: number, selected: boolean, onClick: (n: number) => void}) {
    return (
        <Pressable style={[tabsStyle.single, (selected ? tabsStyle.selected : null)]} onPress={() => onClick(id)}>
            <Text>{id+1}</Text>
        </Pressable>
    )
}

type RoundTabsProps = {
    tabs: number,
    selectedRound: number,
    setSelectedRound: (round: number) => void,
}

const tabsStyle = StyleSheet.create({
    container: {
        width: '100vw',
    },
    root: {
        display: 'flex',
        flexDirection: 'row',
    },
    single: {
        textAlign: 'center',
        backgroundColor: 'rgb(250,245,245)',
        width: 50,
        height: 50,
    },
    selected: {
        backgroundColor: 'lightgray',
        borderRadius: 5,
        shadowRadius: 3,
        marginRight: 2,
        marginTop: 1,
    }
})
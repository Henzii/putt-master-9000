import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Game } from '../../hooks/useGame';
import { theme } from '../../utils/theme';

export default function RoundTabs({ gameData, selectedRound, setSelectedRound }: RoundTabsProps) {
    const tabsList: JSX.Element[] = [];

    for (let i = 0; i < gameData.holes; i++) {

        // Monenko pelaajan tuloksia kyseiseltä väylältä on kirjattuna
        const scoresEnteredForRound = gameData.scorecards.reduce(( p,c ) => {
            if (!c.scores[i]) return p;
            return (p+1);
        },0);

        // Onko väylä valmis = kaikille pelaajille kirjattu väylältä tulos
        const finished = (scoresEnteredForRound === gameData.scorecards.length);

        if (i>0 && scoresEnteredForRound > 0 && !tabsList[i-1].props.finished) {
            tabsList[i-1] = <SingleTab key={'singleTab'+(i-1)} {...tabsList[i-1].props} skipped={true} />;
        }

        tabsList.push(
            <SingleTab
                key={'singleTab' + i}
                skipped={false}
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
    );
}

function SingleTab({ id, selected, onClick, finished, skipped }: SingleTabProps ) {
    const tausta = (
        finished && selected ? tabsStyle.finishedAndSelected :
        selected ? tabsStyle.selected :
        finished ? tabsStyle.finished :
        skipped ? tabsStyle.skipped :
        null
    );
    return (
        <Pressable onPress={() => onClick(id)}>
            <View style={[tabsStyle.single, tausta]} >
                <Text style={tabsStyle.text}>{id+1}</Text>
            </View>
        </Pressable>
    );
}
type SingleTabProps = {
    id: number,
    selected: boolean,
    onClick: (n: number) => void,
    finished: boolean,
    skipped: boolean,
}
type RoundTabsProps = {
    gameData: Game,
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
    skipped: {
        backgroundColor: 'rgb(225,120,120)'
    },
    finished: {
        backgroundColor: 'rgb(180,220,180)'
    },
    finishedAndSelected: {
        borderBottomWidth: 0,
        backgroundColor: 'rgb(180, 255, 180)'
    }
});
import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Animated } from 'react-native';
import { Game } from '../hooks/useGame';

const TAB_WIDTH = 47;
const TAB_HEIGHT = 47;
const TAB_RISE = 10;
const TAB_SIZE = 47;

const BORDER_COLOR = "#6a6a6a";

export default function RoundTabs({ gameData, selectedRound, setSelectedRound }: RoundTabsProps) {
    const tabsList: JSX.Element[] = [];
    const scrollRef = useRef<ScrollView>(null);
    // Kun rata vaihtuu, scrollataan rata esille
    useEffect(() => {
        scrollRef.current?.scrollTo({
            x: (selectedRound > 4 ? (selectedRound-2)*TAB_WIDTH : 0),
            animated: true
        });
    }, [selectedRound]);
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
                ref={scrollRef}
            >
                {tabsList}
            </ScrollView>
        </View>
    );
}

const Separator = () => <View style={{ borderBottomWidth: 1, borderBottomColor: BORDER_COLOR, width: 1 }} />;

function SingleTab({ id, selected, onClick, finished, skipped }: SingleTabProps ) {
    const riseAnim = useRef(new Animated.Value(TAB_SIZE)).current;
    useEffect(() => {
        if (selected) {
            Animated.timing(riseAnim, {
                toValue: TAB_SIZE + TAB_RISE,
                duration: 500,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(riseAnim, {
                toValue: TAB_SIZE,
                duration: 500,
                useNativeDriver: false,
            }).start();
        }
    }, [selected]);
    const styles = [
        tabsStyle.single,
        selected && tabsStyle.selected,
        finished && tabsStyle.finished,
        skipped && tabsStyle.skipped
    ];
    return (
        <>
        <Pressable onPress={() => onClick(id)} testID="SingleTab">
            <Animated.View style={[styles, {
                height: riseAnim,
                width: riseAnim
            }]} >
                <Text style={selected ? tabsStyle.textSelected : tabsStyle.text}>{id+1}</Text>
            </Animated.View>
        </Pressable>
        <Separator />
        </>
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
    gameData: Pick<Game, 'holes' | 'scorecards'>,
    selectedRound: number,
    setSelectedRound: (round: number) => void,
}

const tabsStyle = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 2,
        minHeight: TAB_HEIGHT + TAB_RISE + 2,
    },
    root: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    text: {
        fontSize: 17,
        fontWeight: '600'
    },
    textSelected: {
        fontSize: 19,
        fontWeight: 'bold'
    },
    single: {
        borderWidth: 1,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderColor: BORDER_COLOR,
        width: TAB_WIDTH,
        minHeight: TAB_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.7,
        backgroundColor: '#dedede'
    },
    selected: {
        borderBottomWidth: 0,
        opacity: 1,
        backgroundColor: 'white',
        elevation: 2,
    },
    skipped: {
        backgroundColor: 'rgb(225,120,120)'
    },
    finished: {
        backgroundColor: 'rgb(180,220,180)'
    },
});
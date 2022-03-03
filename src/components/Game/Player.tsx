import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Card } from 'react-native-paper';
import { Scorecard } from '../../hooks/useGame';

type PlayerArgs = {
    player: Scorecard,
    selectedRound: number,
    setScore: (playerId: string, selectedRound: number, value: number) => void,
}
/**
 *  ### Pejaala
 *  Renderöi yhden pelaajan + tulosnapit
 *
 *  @param player Pelaajan Scorecard
 *  @param selectedRound Valittu kierros
 *  @param setScore callback tuloksen asettamiselle. Saa parateriksi tuloksen
 */
export default function Player({ player, selectedRound, setScore }: PlayerArgs): JSX.Element {
    const [pendingButton, setPendingButton] = useState<number | undefined>();
    const listRef = useRef<FlatList>(null);
    const napitData = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    // Tulosten päivittyessä poistetaan pelaajalta pending
    useEffect(() => {
        if (pendingButton) setPendingButton(undefined);
    }, [player]);
    // Valittu rata vaihtuu, scrollataan alkuun
    useEffect(() => {
        listRef.current?.scrollToIndex({ index: 0 });
    }, [selectedRound]);

    const handleButtonClick = (score: number) => {
        setScore(player.user.id as string, selectedRound, score);
        setPendingButton(score);
    };
    return (
        <Card style={tyyli.main}>
            <Card.Title
                title={player.user.name}
            />
            <Card.Content style={tyyli.content}>
                <View style={tyyli.contentLeft}>
                    <FlatList
                        ref={listRef}
                        data={napitData}
                        renderItem={({ item, index }) => {
                            return <ScoreButton
                                number={item}
                                onClick={handleButtonClick}
                                selected={(player.scores[selectedRound] - 1 === index)}
                                pending={(pendingButton === item)}
                            />;
                        }}
                        horizontal
                        onEndReached={() => {
                            if (napitData.length < 50) napitData.push(napitData.length + 1);
                        }}
                        onEndReachedThreshold={0.1}
                        keyExtractor={item => 'avain' + player.user.id + item}
                        initialScrollIndex={0}
                    />
                </View>
                <View style={tyyli.contentRight}>
                    <Text style={tyyli.crText}>
                        {((player.plusminus || 0) > 0 ? '+' : '')}
                        {player.plusminus}
                    </Text>
                </View>
            </Card.Content>
        </Card>

    );

}
const ScoreButton = ({ onClick, number, selected, pending }: { onClick?: (score: number) => void, number: number, selected: boolean, pending: boolean }) => {
    const bgStyles = [
        tyyli.scoreButton,
        pending && tyyli.scoreButtonPending,
        selected && tyyli.scoreButtonSelected,
    ];
    return (
        <Pressable
            style={bgStyles}
            onPress={onClick?.bind(this, number)}
        >
            <Text>{number}</Text>
        </Pressable>
    );
};

const tyyli = StyleSheet.create({
    scoreButton: {
        marginRight: 5,
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: 'lightgray',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 7,
    },
    scoreButtonPending: {
        borderColor: 'orange',
        backgroundColor: 'darkgreen',
    },
    scoreButtonSelected: {
        backgroundColor: 'salmon',
        borderColor: 'green'
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    contentLeft: {
        flex: 4,
    },
    contentRight: {
        flex: 1,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    crText: {
        fontSize: 23,
    },
    main: {
        minHeight: 120,
        width: '100%',
        shadowRadius: 3,
        marginBottom: 1,
        padding: 10,
    }
});

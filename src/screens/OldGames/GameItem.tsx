import { format, fromUnixTime } from "date-fns";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Caption, Chip, Subheading, Title } from "react-native-paper";
import { Game } from "../../hooks/useGame";

interface GameItemProps {
    onClick: (gameid: string, gameOpen?: boolean) => void,
    game: Game,
    myId: string,
}

export default function GameItem(props: GameItemProps) {
    const { onClick, game, myId } = props;
    const handleGameClick = () => {
        if (onClick) onClick(game.id, game.isOpen);
    };
    const date = format(fromUnixTime(game.startTime / 1000), 'dd.MM.yyyy HH:mm');
    return (
        <Pressable onPress={handleGameClick} style={tyyli.container} >
            <View style={tyyli.card}>
                <View style={tyyli.cardLeft}>
                    <Title style={tyyli.courseName}>{game.course}</Title>
                    <Subheading style={tyyli.layoutName}>{game.layout}</Subheading>
                    <View style={{ marginTop: 25, display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                        {!game.isOpen && game.scorecards
                            .filter(sc => sc.user.id !== myId)
                            .map(sc => {
                                return (
                                    <Chip textStyle={tyyli.avatarText} style={tyyli.avatar} icon="account" key={sc.user.id}>{sc.user.name} ({sc.plusminus})</Chip>
                                );
                        })}
                    </View>
                </View>
                <View style={tyyli.cardRight}>
                    <Caption style={tyyli.alignRight}>{date}</Caption>
                    <View>
                        {game.isOpen
                            ? <Chip style={tyyli.chippi} icon="lock-open-variant">Open</Chip>
                            : <Title style={tyyli.alignRight}>{game.myScorecard.total} ({(game.myScorecard.total || 0) - game.par})</Title>}
                    </View>
                </View>
            </View>
        </Pressable >
    );
}

const tyyli = StyleSheet.create({
    avatar: {
        flexWrap: 'wrap',
        marginRight: 5,
        marginBottom: 5,
        elevation: 1,
        backgroundColor: '#eff3ef',
    },
    avatarText: {
        fontSize: 11,
    },
    card: {
        width: '97%',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff',
        elevation: 2,
        minHeight: 100,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    cardLeft: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    cardRight: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: 10,
        backgroundColor: '#fff',
        right: 15,
    },
    alignRight: {
        textAlign: 'right',
    },
    courseName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 0,
    },
    layoutName: {
        marginVertical: -8,
        opacity: 0.6,
        maxWidth: '70%',
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chippi: {
        marginBottom: 5,
    },
});

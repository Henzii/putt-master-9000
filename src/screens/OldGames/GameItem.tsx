import { format, fromUnixTime } from "date-fns";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Caption, Chip, Subheading, Title, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { Game } from "../../types/game";

interface GameItemProps {
    onClick: (gameid: string, gameOpen?: boolean) => void,
    game: Game,
    myId: string,
}

export default function GameItem(props: GameItemProps) {
    const { onClick, game, myId } = props;
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const handleGameClick = () => {
        if (onClick) onClick(game.id, game.isOpen);
    };
    const date = format(fromUnixTime(game.startTime / 1000), 'dd.MM.yyyy HH:mm');
    return (
        <Pressable onPress={handleGameClick} style={styles.container} >
            <View style={styles.card}>
                <View style={styles.cardLeft}>
                    <Title style={styles.courseName}>{game.course}</Title>
                    <Subheading style={styles.layoutName}>{game.layout}</Subheading>
                    <View style={{ marginTop: 25, display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                        {!game.isOpen && game.scorecards
                            .filter(sc => sc.user.id !== myId)
                            .map(sc => {
                                return (
                                    <Chip textStyle={styles.avatarText} style={styles.avatar} icon="account" key={sc.user.id}>{sc.user.name} ({sc.plusminus})</Chip>
                                );
                        })}
                    </View>
                    {game.groupName || game.bHcMultiplier !== 1 ? (
                        <>
                        <View style={{flexDirection: 'row', marginTop: 12, gap: 5}}>
                        {game.groupName && <Chip icon="account-group">{game.groupName}</Chip>}
                        {game.bHcMultiplier !== 1 && <Chip icon="beer">bHc {game.bHcMultiplier}x</Chip>}
                        </View>
                        </>
                    ): null}
                </View>
                <View style={styles.cardRight}>
                    <Caption style={styles.alignRight}>{date}</Caption>
                    <View>
                        {game.isOpen
                            ? <Chip style={styles.chippi} icon="lock-open-variant">Open</Chip>
                            : (
                                game.myScorecard && <Title style={styles.alignRight}>{game.myScorecard.total} ({(game.myScorecard.total || 0) - game.par})</Title>
                            )}
                    </View>
                </View>
            </View>
        </Pressable >
    );
}

const createStyles = (colors: MD3Colors) => StyleSheet.create({
    avatar: {
        flexWrap: 'wrap',
        marginRight: 5,
        marginBottom: 5,
        elevation: 1,
        backgroundColor: colors.surfaceVariant,
    },
    avatarText: {
        fontSize: 11,
    },
    card: {
        width: '97%',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: colors.surface,
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
        backgroundColor: colors.surface,
        right: 15,
    },
    alignRight: {
        textAlign: 'right',
    },
    courseName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 0,
        color: colors.onSurface,
    },
    layoutName: {
        marginVertical: -8,
        color: colors.onSurfaceVariant,
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

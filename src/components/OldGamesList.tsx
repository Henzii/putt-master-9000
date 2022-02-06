import React from 'react';
import { useQuery } from 'react-apollo';
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Chip, Paragraph, Subheading, Title, useTheme } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-native';
import { GET_OLD_GAMES } from '../graphql/queries';
import { Game } from '../hooks/useGame';
import { newGame } from '../reducers/gameDataReducer';
import Container from './ThemedComponents/Container';

const OldGamesList = () => {
    const { data, loading } = useQuery<{ getGames: Game[] }>(GET_OLD_GAMES);
    const dispatch = useDispatch();
    const navi = useNavigate();
    const handleGameActivation = (gameId: string) => {
        dispatch(newGame(gameId));
        navi('/game');
    }
    if (loading || !data?.getGames) {
        return (
            <View><Text>Loading...</Text></View>
        )
    }

    return (
        <Container noPadding>
            <Container noFlex>
                <Title>Old games</Title>
                <Paragraph>
                    Tap game to activate it
                </Paragraph>
            </Container>
            <FlatList
                data={data.getGames}
                renderItem={({ item }) => <SingleGame game={item} onClick={handleGameActivation} />}
                ItemSeparatorComponent={Separator}
            />
        </Container>
    )
}
const SingleGame = ({ game, onClick }: { game: Game, onClick?: (id: string) => void }) => {
    const { colors } = useTheme();
    const handleGameClick = () => {
        if (onClick) onClick(game.id);
    }
    return (
        <Pressable onPress={handleGameClick} >
            <View style={[tyyli.singleGame, { backgroundColor: colors.surface }, (game.isOpen) ? { opacity: 1 } : null]}>
                <View>
                    <Title>{game.course}</Title>
                    <Subheading>{game.layout}</Subheading>
                </View>
                <View>
                    {game.isOpen ? <Chip icon="lock-open-variant">Open</Chip> : null }
                </View>
            </View>
        </Pressable>
    )
}
const Separator = () => {
    return (
        <View style={tyyli.separator} />
    )
}
const tyyli = StyleSheet.create({
    singleGame: {
        padding: 5,
        paddingLeft: 20,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    separator: {
        backgroundColor: 'lightgray',
        height: 1,
    }
})

export default OldGamesList;
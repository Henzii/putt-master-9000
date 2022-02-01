import React from 'react';
import { useQuery } from 'react-apollo';
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Paragraph, Subheading, Title } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { GET_OLD_GAMES } from '../graphql/queries';
import { Game } from '../hooks/useGame';
import { newGame } from '../reducers/gameDataReducer';

const OldGamesList = () => {
    const { data, loading } = useQuery<{ getGames: Game[] }>(GET_OLD_GAMES);
    const dispatch = useDispatch();
    const handleGameActivation = (gameId: string) => {
        dispatch(newGame(gameId));
        
    }
    if (loading || !data?.getGames) {
        return (
            <View><Text>Loading...</Text></View>
        )
    }

    return (
        <View style={tyyli.main}>
            <View style={tyyli.container}>
                <Title>Old games</Title>
                <Paragraph>
                    Tap game to activate it
                </Paragraph>
            </View>
            <FlatList
                data={data.getGames}
                renderItem={({ item }) => <SingleGame game={item} onClick={handleGameActivation} />}
                ItemSeparatorComponent={Separator}
            />
        </View >
    )
}
const SingleGame = ({ game, onClick }: { game: Game, onClick?: (id: string) => void }) => {
    const handleGameClick = () => {
        if (onClick) onClick(game.id);
    }
    return (
        <Pressable onPress={handleGameClick} >
            <View style={tyyli.singleGame}>
                <Title>{game.course}</Title>
                <Subheading>{game.layout}</Subheading>
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
    main: {
        width: '100%',
    },
    container: {
        padding: 20,
    },
    singleGame: {
        padding: 5,
        paddingLeft: 20,
    },
    separator: {
        backgroundColor: 'lightgray',
        height: 1,
    }
})

export default OldGamesList;
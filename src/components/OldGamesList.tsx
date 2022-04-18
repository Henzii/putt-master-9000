import React, { useCallback, useState } from 'react';
import { useQuery } from 'react-apollo';
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Button, Caption, Chip, Paragraph, Searchbar, Subheading, Title, useTheme } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-native';
import { GET_OLD_GAMES } from '../graphql/queries';
import { Game } from '../hooks/useGame';
import { newGame } from '../reducers/gameDataReducer';
import Loading from './Loading';
import Container from './ThemedComponents/Container';
import { format, fromUnixTime } from 'date-fns';
import useTextInput from '../hooks/useTextInput';

const OldGamesList = () => {
    const { data, loading } = useQuery<{ getGames: Game[] }>(GET_OLD_GAMES, { fetchPolicy: 'cache-and-network' });

    const [showSearchBar, setShowSearchBar] = useState(false);
    const [filterText, setFilterText] = useState('');
    const filter = useTextInput({ defaultValue: '', callBackDelay: 500 }, (value) => {
        setFilterText(value);
    });
    const filteredGames = useCallback((games: Game[]) => {
        return games.filter(g => g.course.toLowerCase().includes(filterText.toLowerCase()));
    }, [filterText]);
    const dispatch = useDispatch();
    const navi = useNavigate();
    const handleGameActivation = (gameId: string) => {
        dispatch(newGame(gameId));
        navi('/game');
    };
    if (loading || !data?.getGames) {
        return (
            <Loading />
        );
    }
    return (
        <Container noPadding>
            <Container noFlex>
                <Title>Games</Title>
                <Paragraph>
                    You have played {data.getGames?.length} rounds
                </Paragraph>
                <Button mode='outlined' onPress={() => setShowSearchBar((p) => !p)}>Filter</Button>
                <>
                    {showSearchBar && <Searchbar {...filter} autoComplete={false} />}
                </>
            </Container>
            <FlatList
                data={filteredGames(data.getGames)}
                renderItem={({ item }) => <SingleGame game={item} onClick={handleGameActivation} />}
                ItemSeparatorComponent={Separator}
            />
        </Container>
    );
};
const SingleGame = ({ game, onClick }: { game: Game, onClick?: (id: string) => void }) => {
    const { colors } = useTheme();
    const handleGameClick = () => {
        if (onClick) onClick(game.id);
    };
    const date = format(fromUnixTime(game.startTime/1000), 'dd.MM.yyyy HH:mm');
    return (
        <Pressable onPress={handleGameClick} >
            <View style={[tyyli.singleGame, { backgroundColor: colors.surface }, (game.isOpen) ? { opacity: 1 } : null]}>
                <View style={tyyli.split}>
                    <Title>{game.course}</Title>
                    <Caption>{date}</Caption>
                </View>
                <View style={tyyli.split}>
                    <View>
                        <Subheading>{game.layout}</Subheading>
                    </View>
                    <View>
                        {game.isOpen
                            ? <Chip style={tyyli.chippi} icon="lock-open-variant">Open</Chip>
                            : <Title>{game.myScorecard.total} ({(game.myScorecard.total || 0) - game.par})</Title>}
                    </View>
                </View>
            </View>
        </Pressable >
    );
};
const Separator = () => {
    return (
        <View style={tyyli.separator} />
    );
};
const tyyli = StyleSheet.create({
    chippi: {
        marginBottom: 5,
    },
    split: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    singleGame: {
        padding: 5,
        paddingLeft: 20,
        paddingRight: 10,
        paddingBottom: 10,
        alignItems: 'center',
    },
    separator: {
        backgroundColor: 'lightgray',
        height: 1,
    }
});

export default OldGamesList;
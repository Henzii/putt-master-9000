import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Paragraph, Searchbar, Title } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-native';
import { GET_OLD_GAMES } from '../../graphql/queries';
import { Game } from '../../hooks/useGame';
import { newGame } from '../../reducers/gameDataReducer';
import Loading from '../../components/Loading';
import Container from '../../components/ThemedComponents/Container';
import useTextInput from '../../hooks/useTextInput';
import GameItem from './GameItem';
import useMe from '../../hooks/useMe';
type GamesQueryResponse = {
    games: Game[],
    hasMore: boolean,
    nextOffset: number,
    count: number,
}

const GAMES_LIMIT = 20;

const OldGames = () => {
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [filterText, setFilterText] = useState('');
    const { data, loading, fetchMore } = useQuery<{ getGames: GamesQueryResponse}>(
        GET_OLD_GAMES,
        {
            fetchPolicy: 'cache-and-network',
            variables: {
                limit: GAMES_LIMIT,
                offset: 0,
                search: filterText,
            }
        }
    );

    const filter = useTextInput({ defaultValue: '', callBackDelay: 500 }, (value) => {
        setFilterText(value);
    });
    const dispatch = useDispatch();
    const navi = useNavigate();
    const {me} = useMe();

    const games= data?.getGames?.games;

    const handleGameActivation = (gameId: string, gameOpen?: boolean) => {
        dispatch(newGame(gameId, gameOpen));
        navi('/game');
    };
    const fetchMoreGames = () => {
        if (!data?.getGames?.games || loading || !data.getGames.hasMore) return;
        fetchMore({
            variables: { limit: GAMES_LIMIT, offset: data.getGames.nextOffset },
            updateQuery: (previous, { fetchMoreResult }) => {
                if (!fetchMoreResult) return previous;
                return {
                    getGames: {
                        ...fetchMoreResult.getGames,
                        games: previous.getGames.games.concat(fetchMoreResult.getGames.games),
                    }
                };
            }
        });
    };
    if (!data?.getGames || !me) {
        return (
            <Loading />
        );
    }
    return (
        <Container noPadding>
            <Container noFlex>
                <Title>Games</Title>
                <Paragraph>
                    Total {data.getGames.count} rounds
                </Paragraph>
                <Button mode='outlined' onPress={() => setShowSearchBar((p) => !p)}>Filter</Button>
                <>
                    {showSearchBar && <Searchbar {...filter} autoComplete='off' autoFocus />}
                </>
            </Container>
            <FlatList
                data={games}
                renderItem={({ item }) => <GameItem myId={me.id as string} game={item} onClick={handleGameActivation} />}
                ItemSeparatorComponent={Separator}
                onEndReachedThreshold={1}
                onEndReached={fetchMoreGames}
                ListFooterComponent={(loading ? <Loading noFullScreen loadingText='Fetching more...' /> : undefined)}
            />
        </Container>
    );
};

const Separator = () => {
    return (
        <View style={tyyli.separator} />
    );
};
const tyyli = StyleSheet.create({
     separator: {
        height: 5,
    }
});

export default OldGames;
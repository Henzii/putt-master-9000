import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { FlatList, StyleSheet, View, Text } from "react-native";
import { IconButton, Paragraph, Searchbar, Switch, Title } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-native';
import { GET_OLD_GAMES } from '../../graphql/queries';
import { newGame } from '../../reducers/gameDataReducer';
import Loading from '../../components/Loading';
import Container from '../../components/ThemedComponents/Container';
import useTextInput from '../../hooks/useTextInput';
import GameItem from './GameItem';
import { Game } from '../../types/game';
import { RootState } from '../../utils/store';
import SplitContainer from '../../components/ThemedComponents/SplitContainer';
import Spacer from '../../components/ThemedComponents/Spacer';
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
    const user = useSelector((state: RootState) => state.user);
    const [showOnlyGroupGames, setShowOnlyGroupGames] = useState(false);

    const { data, loading, fetchMore } = useQuery<{ getGames: GamesQueryResponse}>(
        GET_OLD_GAMES,
        {
            fetchPolicy: 'cache-and-network',
            variables: {
                limit: GAMES_LIMIT,
                offset: 0,
                search: filterText,
                onlyGroupGames: showOnlyGroupGames
            }
        }
    );

    const filter = useTextInput({ defaultValue: '', callBackDelay: 500 }, (value) => {
        setFilterText(value);
    });
    const dispatch = useDispatch();
    const navi = useNavigate();

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
    if (!data?.getGames || !user.isLoggedIn) {
        return (
            <Loading />
        );
    }
    return (
        <Container noPadding>
            <Container noFlex style={{paddingBottom: 0}}>
                <SplitContainer style={{flexWrap: 'wrap'}}>
                    <View>
                        <Title>Games</Title>
                        <Paragraph>
                            Total {data.getGames.count} rounds
                        </Paragraph>
                    </View>
                {showSearchBar
                    ? <Searchbar {...filter} autoComplete='off' autoFocus traileringIcon="close" onTraileringIconPress={() => setShowSearchBar(false)} />
                    : <IconButton icon="magnify" onPress={() => setShowSearchBar(true)} />}
                </SplitContainer>
            </Container>
            {!!user.groupName && (
                <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10}}>
                    <Switch value={showOnlyGroupGames} onValueChange={setShowOnlyGroupGames} />
                    <Text>Show only group games</Text>
                </View>
            )}
            <Spacer />
            <FlatList
                data={games}
                renderItem={({ item }) => <GameItem myId={user.id as string} game={item} onClick={handleGameActivation} />}
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
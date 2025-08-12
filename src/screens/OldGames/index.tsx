import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { FlatList, StyleSheet, View, } from "react-native";
import { IconButton, Searchbar, Switch, Text, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-native';
import { GET_OLD_GAMES } from '../../graphql/queries';
import { newGame } from '../../reducers/gameDataReducer';
import Loading from '../../components/Loading';
import useTextInput from '../../hooks/useTextInput';
import GameItem from './GameItem';
import { Game } from '../../types/game';
import { RootState } from '../../utils/store';
import SplitContainer from '../../components/ThemedComponents/SplitContainer';
import Header from '../../components/RoundedHeader/Header';
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
    const user = useSelector((state: RootState) => state.user.isLoggedIn ? state.user : undefined);
    const [showOnlyGroupGames, setShowOnlyGroupGames] = useState(false);
    const { colors } = useTheme();
    const [headerSpacing, setHeaderSpacing] = useState(81);

    const { data, loading, fetchMore } = useQuery<{ getGames: GamesQueryResponse }>(
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

    const games = data?.getGames?.games;

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

    return (
        <View style={{flex: 1}}>
            <Header setSpacing={setHeaderSpacing} bottomSize={20}>
                <SplitContainer style={{ flexWrap: 'wrap' }}>
                    <View>
                        <Text variant="headlineSmall" style={styles.header}>Games</Text>
                        <Text style={styles.header}>
                            Total {data?.getGames.count ?? '--'} rounds
                        </Text>
                    </View>
                    <IconButton icon="magnify" mode="contained-tonal" containerColor={colors.tertiary} onPress={() => setShowSearchBar(val => !val)} />
                </SplitContainer>
                <Spacer size={1} />
                {Boolean(user?.groupName) && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Switch value={showOnlyGroupGames} onValueChange={setShowOnlyGroupGames} color={colors.tertiary} />
                        <Text style={styles.header}>Show only group games</Text>
                    </View>
                )}
                {showSearchBar && <Searchbar {...filter} autoComplete='off' autoFocus traileringIcon="close" onTraileringIconPress={() => setShowSearchBar(false)} />}

            </Header>
            {loading && !games ? <Loading loadingText="Loading games..." /> : (
                <FlatList
                    data={games}
                    renderItem={({ item }) => <GameItem myId={(user?.id ?? '').toString()} game={item} onClick={handleGameActivation} />}
                    contentContainerStyle={{ paddingVertical: headerSpacing * 2 - 10}}
                    ItemSeparatorComponent={Separator}
                    onEndReachedThreshold={1}
                    onEndReached={fetchMoreGames}
                    ListFooterComponent={(loading ? <Loading noFullScreen loadingText='Fetching more...' /> : undefined)}
                />
            )}
        </View>
    );
};

const Separator = () => {
    return (
        <View style={styles.separator} />
    );
};
const styles = StyleSheet.create({
    separator: {
        height: 5,
    },
    header: {
        color: '#fff'
    }
});

export default OldGames;
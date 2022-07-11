import React, { useCallback, useState } from 'react';
import { useQuery } from 'react-apollo';
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

const OldGames = () => {
    const { data, loading } = useQuery<{ getGames: Game[] }>(GET_OLD_GAMES, { fetchPolicy: 'cache-and-network' });

    const [showSearchBar, setShowSearchBar] = useState(false);
    const [filterText, setFilterText] = useState('');

    const filter = useTextInput({ defaultValue: '', callBackDelay: 500 }, (value) => {
        setFilterText(value);
    });
    const filteredGames = useCallback(() => {
        return data?.getGames.filter(g => g.course.toLowerCase().includes(filterText.toLowerCase())) || [];
    }, [filterText, data?.getGames]);
    const dispatch = useDispatch();
    const navi = useNavigate();

    const handleGameActivation = (gameId: string, gameOpen?: boolean) => {
        dispatch(newGame(gameId, gameOpen));
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
                    Total {filteredGames().length} rounds
                </Paragraph>
                <Button mode='outlined' onPress={() => setShowSearchBar((p) => !p)}>Filter</Button>
                <>
                    {showSearchBar && <Searchbar {...filter} autoComplete={false} autoFocus />}
                </>
            </Container>
            <FlatList
                data={filteredGames()}
                renderItem={({ item }) => <GameItem game={item} onClick={handleGameActivation} />}
                ItemSeparatorComponent={Separator}
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
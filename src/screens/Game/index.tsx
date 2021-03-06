import React, { useEffect, useState } from 'react';
import { useMutation, useApolloClient } from 'react-apollo';
import { BottomNavigation } from 'react-native-paper';
import { AppState } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-native';
import { ADD_PLAYERS_TO_GAME, CREATE_GAME } from '../../graphql/mutation';
import { GET_OLD_GAMES } from '../../graphql/queries';
import { gameData, newGame } from '../../reducers/gameDataReducer';
import { addNotification } from '../../reducers/notificationReducer';
import { RootState } from '../../utils/store';
import Beers from './Beers';
import CreateGame, { NewGameData } from './CreateGame';
import Game from './Game';
import Setup from './Setup';
import Summary from './Summary';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GameContainer() {
    /*
        HOOKS
    */
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    const [createGameMutation, { loading }] = useMutation(CREATE_GAME, { refetchQueries: [{ query: GET_OLD_GAMES }] });
    const [addPlayersMutation] = useMutation(ADD_PLAYERS_TO_GAME);
    const dispatch = useDispatch();
    const navi = useNavigate();
    const client = useApolloClient();

    const [navIndex, setNavIndex] = useState(gameData?.gameOpen === false ? 1 : 0);
    const [navRoutes, setNavRoutes] = useState([
        { key: 'gameRoute', title: 'Scorecard', icon: 'counter' },
        { key: 'summaryRoute', title: 'Summary', icon: 'format-list-numbered' },
//      { key: 'beerRoute', title: 'Beers', icon: 'beer-outline' },
        { key: 'setupRoute', title: 'Setup', icon: 'cog-outline' },
    ]);
    useEffect(() => {
        // Listeneri joka kuuntelee sovelluksen tilaa
        AppState.addEventListener('change', _handleAppStateChange);

        // Haetaan asyncstoragesta tieto näytetäänkö beers-välilehti ja tarvittaessa lisätään navroute
        AsyncStorage.getItem('hideBeers').then((res) => {
            if (res === 'false') {
                const copyOfNavRoutes = [...navRoutes];
                copyOfNavRoutes.splice(2, 0, { key: 'beerRoute', title: 'Beers', icon: 'beer-outline' });
                setNavRoutes(copyOfNavRoutes);
            }
        });

        return () => AppState.removeEventListener('change', _handleAppStateChange);
    }, []);
    /*
        ******************
    */

    // Kun sovellus palaa taustatilasta, päivitetään data palvelimelta
    const _handleAppStateChange = (nextAppState: string) => {
        if (nextAppState === 'active') {
            client.reFetchObservableQueries(true);
        }
    };
    const handleCreateGame = async (data: NewGameData) => {
        if (!data.layout || !data.course) return;
        const res = await createGameMutation({
            variables: { courseId: data.course.id, layoutId: data.layout.id }
        });
        const newGameId = res.data.createGame;
        await addPlayersMutation({
            variables: {
                gameId: newGameId,
                playerIds: data.players.map(p => p.id)
            }
        });
        dispatch(newGame(newGameId));
        dispatch(addNotification('New game created!', 'success'));
    };
    // Jos peliä ei ole ladattu -> createGame, tai jos erroreita tai loading tms...
    if (!gameData?.gameId) {
        return <CreateGame onCreate={handleCreateGame} onCancel={() => navi(-1)} loading={loading} />;
    }

    // Alanaville:
    const naviScenes = BottomNavigation.SceneMap({
        gameRoute: Game,
        setupRoute: Setup,
        beerRoute: Beers,
        summaryRoute: Summary,
    });
    return (
        <BottomNavigation
            shifting={false}
            style={{ width: '100%' }}
            navigationState={{ index: navIndex, routes: navRoutes }}
            onIndexChange={setNavIndex}
            renderScene={naviScenes}
        />
    );

}


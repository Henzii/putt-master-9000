import React, { useEffect, useState } from 'react';
import { useMutation, useApolloClient } from '@apollo/client';
import { BottomNavigation } from 'react-native-paper';
import { AppState, Platform, Vibration } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-native';
import { ADD_PLAYERS_TO_GAME, CREATE_GAME } from '../../graphql/mutation';
import { GET_OLD_GAMES } from '../../graphql/queries';
import { gameData, newGame, unloadGame } from '../../reducers/gameDataReducer';
import { addNotification } from '../../reducers/notificationReducer';
import { RootState } from '../../utils/store';
import Beers from './Beers';
import CreateGame, { NewGameData } from './CreateGame';
import Game from './Game';
import Setup from './Setup';
import Summary from './Summary/Summary';
import { useSettings } from '../../components/LocalSettingsProvider';
import { GAME_SUBSCRIPTION } from '../../graphql/subscriptions';
import { updateGame } from '../../utils/gameCahcheUpdates';
import { useSubscription } from '../../hooks/useSubscription';
import useMe from '../../hooks/useMe';

export default function GameContainer() {
    /*
        HOOKS
    */
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    const {gameId} = gameData ?? {};
    const {me} = useMe();
    const [createGameMutation, { loading }] = useMutation(CREATE_GAME, { refetchQueries: [{ query: GET_OLD_GAMES }] });
    const [addPlayersMutation] = useMutation(ADD_PLAYERS_TO_GAME);
    const dispatch = useDispatch();
    const navi = useNavigate();
    const location = useLocation();
    const client = useApolloClient();
    const params = useParams();
    useSubscription(
        (data) => {
            const response = data?.data?.gameUpdated;
            if (!response || response.updaterId === me?.id) return;
            updateGame(response.game, client);

            if (response.updaterId !== me?.id && Platform.OS === 'android') {
                Vibration.vibrate([100, 100]);
            }
        },
        (error) => {
            // eslint-disable-next-line no-console
            console.log(error);
            dispatch(addNotification('Subscription failed. The game data is not updated in real time.', "warning"));
        },
        { query: GAME_SUBSCRIPTION, variables: { gameId: gameId }, dependency: gameId}
    );
    const [navIndex, setNavIndex] = useState(gameData?.gameOpen === false ? 1 : 0);
    const settings = useSettings();
    const [navRoutes, setNavRoutes] = useState([
        { key: 'gameRoute', title: 'Scorecard', focusedIcon: 'card-account-details', unfocusedIcon: 'card-account-details-outline' },
        { key: 'summaryRoute', title: 'Summary', focusedIcon: 'view-list', unfocusedIcon: 'view-list-outline' },
//      { key: 'beerRoute', title: 'Beers', icon: 'beer-outline' },
        { key: 'setupRoute', title: 'Setup', focusedIcon: 'cog', unfocusedIcon: 'cog-outline' },
    ]);
    useEffect(() => {
        if (location.search === '?force' && gameData?.gameId) {
            dispatch(unloadGame());
        } else if (params?.gameId && (params?.gameId !== gameData?.gameId)) {
            dispatch(newGame(params.gameId));
        }
    }, []);
    useEffect(() => {
        const hasBeerRoute = !!navRoutes.find(r => r.key === 'beerRoute');
        const copyOfNavRoutes = [...navRoutes];
        if (!settings.getBoolValue('Prohibition') && !hasBeerRoute) {
            copyOfNavRoutes.splice(2, 0, { key: 'beerRoute', title: 'Beers', focusedIcon: 'beer', unfocusedIcon: 'beer-outline' });
            setNavRoutes(copyOfNavRoutes);
            if (navIndex >= 2) {
                setNavIndex(navIndex + 1);
            }
        } else if (settings.getBoolValue('Prohibition') && hasBeerRoute) {
            setNavRoutes(copyOfNavRoutes.filter(route => route.key !== 'beerRoute'));
            if (navIndex >= 2) {
                setNavIndex(navIndex - 1);
            }
        }
    }, [settings]);

    useEffect(() => {
        // Listeneri joka kuuntelee sovelluksen tilaa
        const listener = AppState.addEventListener('change', _handleAppStateChange);
        return () => listener.remove();
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
        setNavIndex(0);
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
            // style={{ width: '100%' }}
            navigationState={{
                index: navIndex,
                routes: navRoutes,
            }}
            onIndexChange={setNavIndex}
            renderScene={naviScenes}
        />
    );

}


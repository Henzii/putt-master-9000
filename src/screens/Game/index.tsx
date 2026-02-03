import React, { useEffect, useMemo, useState } from 'react';
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
import ThrowStyle from './ThrowStyle';
import HoleMap from './HoleMap';
import { useGameStore } from 'src/zustand/gameStore';
import { useTranslation } from 'react-i18next';

const NAV_ROUTES_CONFIG = [
    { key: 'gameRoute', titleKey: 'screens.game.tabs.scorecard', focusedIcon: 'card-account-details', unfocusedIcon: 'card-account-details-outline' },
    { key: 'mapRoute', titleKey: 'screens.game.tabs.teeSign', focusedIcon: 'sign-text', unfocusedIcon: 'sign-text' },
    { key: 'summaryRoute', titleKey: 'screens.game.tabs.summary', focusedIcon: 'view-list', unfocusedIcon: 'view-list-outline' },
    { key: 'throwStyleRoute', titleKey: 'screens.game.tabs.throwStyle', focusedIcon: 'dice-3', unfocusedIcon: 'dice-3-outline' },
    { key: 'beerRoute', titleKey: 'screens.game.tabs.beers', focusedIcon: 'beer', unfocusedIcon: 'beer-outline' },
    { key: 'setupRoute', titleKey: 'screens.game.tabs.setup', focusedIcon: 'cog', unfocusedIcon: 'cog-outline' },
] as const;

const findIndexOfRoute = (key: string, routes: any[]): number =>
    routes.findIndex(route => route.key === key);

export default function GameContainer() {
    /*
        HOOKS
    */
    const { t } = useTranslation();
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    const [setGameId, clearGameStore] = useGameStore(state => [state.setGameId, state.clear]);

    const NAV_ROUTES = NAV_ROUTES_CONFIG.map(route => ({
        ...route,
        title: t(route.titleKey)
    })).filter(route => {
        if (route.key === 'beerRoute') return true;
        if (route.key === 'mapRoute') return true;
        if (route.key === 'throwStyleRoute') return true;
        return true;
    });

    const { gameId } = gameData ?? {};
    const { me } = useMe();
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
            dispatch(addNotification(t('screens.game.subscriptionFailed'), "warning"));
        },
        { query: GAME_SUBSCRIPTION, variables: { gameId: gameId }, dependency: gameId }
    );
    const settings = useSettings();
    const navRoutes = useMemo(() => NAV_ROUTES.filter(route => {
        if (route.key === 'beerRoute' && settings.getBoolValue('Prohibition')) {
            return false;
        }
        if (route.key === 'throwStyleRoute' && !settings.getBoolValue('RandomThrowStyle')) {
            return false;
        }
        if (route.key === 'mapRoute' && settings.getBoolValue('HideTeeSign')) {
            return false;
        }

        return true;
    }), [settings]);

    const [navIndex, setNavIndex] = useState(findIndexOfRoute(gameData?.gameOpen ? 'gameRoute' : 'summaryRoute', navRoutes));


    useEffect(() => {
        if (location.search === '?force' && gameData?.gameId) {
            dispatch(unloadGame());
        } else if (params?.gameId) {
            if (params?.gameId !== gameData?.gameId) {
                dispatch(newGame(params.gameId));
            }
            setGameId(params.gameId);
        }

        return () => {
            clearGameStore();
        };
    }, []);

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
        try {
            if (!data.layout || !data.course) return;
            if (data.bHcMultiplier && isNaN(Number(data.bHcMultiplier))) {
                throw Error('bHcMultiplier is not a number?');
            }
            const res = await createGameMutation({
                variables: {
                    courseId: data.course.id,
                    layoutId: data.layout.id,
                    isGroupGame: data.isCompetition,
                    bHcMultiplier: data.bHcMultiplier ? Number(data.bHcMultiplier) : undefined
                }
            });
            const newGameId = res.data.createGame;
            await addPlayersMutation({
                variables: {
                    gameId: newGameId,
                    playerIds: data.players.map(p => p.id)
                }
            });
            dispatch(newGame(newGameId));
            setGameId(newGameId);
            dispatch(addNotification(t('screens.game.gameCreated'), 'success'));
            setNavIndex(0);
        } catch {
            dispatch(addNotification(t('screens.game.gameCreationFailed'), 'alert'));
        }
    };
    // Jos peliä ei ole ladattu -> createGame, tai jos erroreita tai loading tms...
    if (!gameData?.gameId) {
        return <CreateGame onCreate={handleCreateGame} onCancel={() => navi(-1)} loading={loading} />;
    }

    // Alanaville:
    const naviScenes = BottomNavigation.SceneMap({
        gameRoute: Game,
        mapRoute: HoleMap,
        setupRoute: Setup,
        beerRoute: Beers,
        summaryRoute: Summary,
        throwStyleRoute: ThrowStyle
    });


    return (
        <BottomNavigation
            shifting={false}
            // style={{ width: '100%' }}
            navigationState={{
                index: navIndex < navRoutes.length ? navIndex : navRoutes.length - 1,
                routes: navRoutes,
            }}
            onIndexChange={setNavIndex}
            renderScene={naviScenes}
        />
    );

}


import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-apollo';
import { BottomNavigation } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-native';
import ErrorScreen from '../../components/ErrorScreen';
import Loading from '../../components/Loading';
import { ABANDON_GAME, ADD_PLAYERS_TO_GAME, CREATE_GAME } from '../../graphql/mutation';
import { GET_OLD_GAMES } from '../../graphql/queries';
import useGame from '../../hooks/useGame';
import { gameData, newGame, unloadGame } from '../../reducers/gameDataReducer';
import { addNotification } from '../../reducers/notificationReducer';
import { RootState } from '../../utils/store';
import Beers from './Beers';
import CreateGame, { NewGameData } from './CreateGame';
import Game from './Game';
import Setup from './Setup';
import Summary from './Summary';

export default function GameContainer() {
    /*
        HOOKS
    */
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    const [createGameMutation] = useMutation(CREATE_GAME, { refetchQueries: [{ query: GET_OLD_GAMES }] });
    const [abandonGameMutation] = useMutation(ABANDON_GAME, { refetchQueries: [{ query: GET_OLD_GAMES }] });
    const [addPlayersMutation] = useMutation(ADD_PLAYERS_TO_GAME);
    const dispatch = useDispatch();
    const navi = useNavigate();

    const { data, error, loading } = useGame(gameData.gameId);

    const [navIndex, setNavIndex] = useState(0);
    const [navRoutes] = useState([
        { key: 'gameRoute', title: 'Scorecard', icon: 'counter' },
        { key: 'summaryRoute', title: 'Summary', icon: 'format-list-numbered' },
        { key: 'beerRoute', title: 'Beers', icon: 'beer-outline' },
        { key: 'setupRoute', title: 'Setup', icon: 'cog-outline' },
    ]);
    /*
        ******************
    */

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
        return <CreateGame onCreate={handleCreateGame} onCancel={() => navi(-1)} />;
    } else if (error) {
        return <ErrorScreen errorMessage={error.message} />;
    } else if (loading) {
        return <Loading />;
    } else if (!data) {
        return <ErrorScreen errorMessage='Mysteeri' />;
    }

    // Alanaville:
    const naviScenes = BottomNavigation.SceneMap({
        gameRoute: () => <Game gameId={gameData.gameId} />,
        setupRoute: () => <Setup onAbandonGame={handleAbandonGame} />,
        beerRoute: () => <Beers data={data} />,
        summaryRoute: Summary,
    });
    const handleAbandonGame = async () => {
        const res = await abandonGameMutation({ variables: { gameId: gameData.gameId } });
        if (res.data.abandonGame) {
            dispatch(unloadGame());
            dispatch(addNotification('Game abandoned', 'success'));
        } else {
            dispatch(addNotification('Something went wrong!', 'alert'));
        }
    };
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

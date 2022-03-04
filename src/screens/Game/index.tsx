import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import { BottomNavigation } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-native';
import { ABANDON_GAME, ADD_PLAYERS_TO_GAME, CREATE_GAME } from '../../graphql/mutation';
import { GET_OLD_GAMES } from '../../graphql/queries';
import { gameData, newGame, unloadGame } from '../../reducers/gameDataReducer';
import { addNotification } from '../../reducers/notificationReducer';
import { RootState } from '../../utils/store';
import CreateGame, { NewGameData } from './CreateGame';
import Game from './Game';
import Setup from './Setup';
import Summary from './Summary';

export default function GameContainer() {
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    const [createGameMutation] = useMutation(CREATE_GAME, { refetchQueries: [{ query: GET_OLD_GAMES }] });
    const [abandonGameMutation] = useMutation(ABANDON_GAME, { refetchQueries: [{ query: GET_OLD_GAMES }] });
    const [addPlayersMutation] = useMutation(ADD_PLAYERS_TO_GAME);
    const dispatch = useDispatch();
    const navi = useNavigate();

    // Alanaville:
    const [navIndex, setNavIndex] = useState(0);
    const [navRoutes] = useState([
        { key: 'gameRoute', title: 'Scorecard', icon: 'counter' },
        { key: 'summaryRoute', title: 'Summary', icon: 'format-list-numbered' },
        { key: 'setupRoute', title: 'Setup', icon: 'cog-outline' },
    ]);
    const naviScenes = BottomNavigation.SceneMap({
        gameRoute: () => <Game gameId={gameData.gameId} />,
        setupRoute: () => <Setup onAbandonGame={handleAbandonGame} />,
        summaryRoute: Summary,
    });
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
    const handleAbandonGame = async () => {
        const res = await abandonGameMutation({ variables: { gameId: gameData.gameId } });
        if (res.data.abandonGame) {
            dispatch(unloadGame());
            dispatch(addNotification('Game abandoned', 'success'));
        } else {
            dispatch(addNotification('Something went wrong!', 'alert'));
        }
    };
    // Jos peliä ei ladattuna, näytetään CreateGame
    if (!gameData?.gameId) {
        return <CreateGame onCreate={handleCreateGame} onCancel={() => navi(-1)} />;
    }
    return (
        <BottomNavigation
            style={{ width: '100%' }}
            navigationState={{ index: navIndex, routes: navRoutes }}
            onIndexChange={setNavIndex}
            renderScene={naviScenes}
        />
    );

}


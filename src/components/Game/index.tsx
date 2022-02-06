import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import { BottomNavigation } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-native';
import { ADD_PLAYERS_TO_GAME, CREATE_GAME } from '../../graphql/mutation';
import { GET_OLD_GAMES } from '../../graphql/queries';
import { gameData, newGame } from '../../reducers/gameDataReducer';
import { addNotification } from '../../reducers/notificationReducer';
import { RootState } from '../../utils/store';
import CreateGame, { NewGameData } from './CreateGame';
import Game from './Game';
import Setup from './Setup';
import Summary from './Summary';

export default function() {
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    const [createGameMutation] = useMutation(CREATE_GAME, { refetchQueries: [ { query: GET_OLD_GAMES }]});
    const [addPlayersMutation] = useMutation(ADD_PLAYERS_TO_GAME);
    const dispatch = useDispatch();
    const navi = useNavigate();

    // Alanaville:
    const [navIndex, setNavIndex] = useState(0);
    const [navRoutes] = useState([
        {key: 'gameRoute', title: 'Scorecard', icon: 'counter'},
        {key: 'summaryRoute', title: 'Summary', icon: 'format-list-numbered'},
        {key: 'setupRoute', title: 'Setup', icon: 'cog-outline'},
    ])
    const naviScenes = BottomNavigation.SceneMap({
        gameRoute: () => <Game gameId={gameData.gameId} />,
        setupRoute: Setup,
        summaryRoute: Summary,
    })
    const handleCreateGame = async (data: NewGameData) => {
        if (!data.layout || !data.course) return;
        const res = await createGameMutation({
            variables: { courseId: data.course.id, layoutId: data.layout.id }
        })
        const newGameId = res.data.createGame;
        console.log('New game:', newGameId);
        await addPlayersMutation({ variables: {
            gameId: newGameId,
            playerIds: data.players.map(p => p.id)
        }})
        dispatch(newGame(newGameId));
        dispatch(addNotification('New game created!', 'success'));
    }
    // Jos peliä ei ladattuna, näytetään CreateGame
    if (!gameData?.gameId) {
        return <CreateGame onCreate={handleCreateGame} onCancel={() => navi(-1)} />
    }
    return (
        <BottomNavigation
            style={{ width: '100%' }}
            navigationState={{ index: navIndex, routes: navRoutes}}
            onIndexChange={setNavIndex}
            renderScene={naviScenes}
        />
    )    
    
}


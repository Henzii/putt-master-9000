import { ApolloClient } from "@apollo/client";
import { Game } from '../hooks/useGame';
import { GET_GAME } from "../graphql/queries";

export const updateGame = (game: Game, client: ApolloClient<object>) => {
    if (!isValidGame(game)) return;
    const gameId = game.id;
    client.writeQuery({
        query: GET_GAME,
        variables: { gameId },
        data: {
            getGame: game
        }
    });
    return;
};

export const updateScorecard = (game: Game, playerId: string, client: ApolloClient<object>) => {
    const updatedScorecard = game.scorecards.find(sc => sc.user.id === playerId);
    const oldData = client.readQuery<{getGame: Game}>({ query: GET_GAME, variables: { gameId: game.id }});
    if (!oldData) return;
    client.writeQuery({
        query: GET_GAME,
        variables: { gameId: game.id },
        data: {
            ...oldData,
            getGame: {
                ...oldData.getGame,
                scorecards: oldData.getGame.scorecards.map(sc => sc.user.id === playerId ? updatedScorecard : sc)
            }
        }
    });
};

const isValidGame = (game: unknown): game is Game => {
    const asGame = game as Game;
    if (asGame.id && asGame.course && asGame.layout_id && typeof asGame.scorecards === 'object') return true;
    return false;
};

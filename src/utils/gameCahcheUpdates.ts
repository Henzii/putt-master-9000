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

const isValidGame = (game: unknown): game is Game => {
    const asGame = game as Game;
    if (asGame.id && asGame.course && asGame.layout_id && typeof asGame.scorecards === 'object') return true;
    return false;
};

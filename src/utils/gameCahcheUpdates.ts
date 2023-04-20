import { ApolloClient } from "@apollo/client";
import { Game } from '../hooks/useGame';
import { GET_GAME } from "../graphql/queries";

export const updateGame = (game: Game, client: ApolloClient<object>, gameId: string) => {
    client.writeQuery({
        query: GET_GAME,
        variables: { gameId },
        data: {
            getGame: game
        }
    });
    return;
};

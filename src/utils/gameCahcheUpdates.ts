import { ApolloClient } from "@apollo/client";
import { GET_GAME } from "../graphql/queries";
import { client } from "../graphql/apolloClient";
import { Game, GetGameResponse, Scorecard } from "../types/game";

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

type UpdateUserScore = (params: {playerId: string, gameId: string, scorecard: Partial<Scorecard>}) => void
export const cacheUpdateUserScores: UpdateUserScore = ({playerId, gameId, scorecard}) => {
    const oldData = client.readQuery<GetGameResponse>({ query: GET_GAME, variables: { gameId }});
    if (!oldData) return;

    client.writeQuery({
        query: GET_GAME,
        variables: { gameId },
        data: {
            ...oldData,
            getGame: {
                ...oldData.getGame,
                scorecards: oldData.getGame.scorecards.map(sc => sc.user.id === playerId ? {...sc, ...scorecard} :  sc)
            }
        }
    });
};

export const updateScorecard = (game: Game, playerId: string, client: ApolloClient<object>) => {
    const updatedScorecard = game.scorecards.find(sc => sc.user.id === playerId);
    const oldData = client.readQuery<GetGameResponse>({ query: GET_GAME, variables: { gameId: game.id }});
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

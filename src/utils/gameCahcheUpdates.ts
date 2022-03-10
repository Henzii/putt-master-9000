import { DataProxy } from "@apollo/client";
import { Game, Scorecard } from '../hooks/useGame';
import { GET_GAME } from "../graphql/queries";

export const updateScorecard = (cache: DataProxy, gameId: string, scorecard: UpdatedScoreCard) => {
    const query = cache.readQuery<{getGame: Game }>({ query: GET_GAME, variables: { gameId } });
    if (!query) return;
    cache.writeQuery({
        query: GET_GAME, variables: { gameId },
        data: {
            getGame: {
                ...query.getGame,
                scorecards: query.getGame.scorecards.map((sc:Scorecard) => {
                    if (sc.user.id === scorecard.user) return {...sc, ...scorecard.scorecard};
                    else return sc;
                })
            }
        }
    });
};

type UpdatedScoreCard = {
    user: string,
    scorecard: Scorecard,
}
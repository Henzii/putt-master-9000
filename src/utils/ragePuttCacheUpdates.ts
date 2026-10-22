import { ApolloCache } from "@apollo/client";
import { GET_RAGE_PUTT_GAME } from "src/graphql/queries";
import { RagePuttGame, RagePuttScorecard } from "src/types/ragetputt";

type RagePuttGameQueryResponse = {
    getRagePuttGame: RagePuttGame | null;
};

type RagePuttGameQueryVariables = {
    gameId: string;
};

export type UpdatedRagePuttScorecard = Pick<RagePuttScorecard, "id" | "scores" | "points">;

export const updateRagePuttScorecardCache = (
    cache: ApolloCache<unknown>,
    gameId: string,
    updatedScorecard: UpdatedRagePuttScorecard
) => {
    cache.updateQuery<RagePuttGameQueryResponse, RagePuttGameQueryVariables>(
        { query: GET_RAGE_PUTT_GAME, variables: { gameId } },
        (cachedData) => {
            const game = cachedData?.getRagePuttGame;
            if (!game) return cachedData;

            return {
                ...cachedData,
                getRagePuttGame: {
                    ...game,
                    scorecards: game.scorecards.map((scorecard) =>
                        scorecard.id === updatedScorecard.id
                            ? { ...scorecard, ...updatedScorecard }
                            : scorecard
                    ),
                },
            };
        }
    );
};

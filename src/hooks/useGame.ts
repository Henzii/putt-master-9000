import { useMutation, useQuery } from '@apollo/client';
import { SET_SCORE, CLOSE_GAME, SET_BEERS } from "../graphql/mutation";
import { GET_GAME } from "../graphql/queries";
import { User } from "./useMe";

const useGame = (gameId: string) => {
    const { data, loading, error } = useQuery<{ getGame: Game }>(
        GET_GAME,
        {
            variables: { gameId },
            fetchPolicy: 'cache-and-network',
        });
    const [closeGameMutation] = useMutation(CLOSE_GAME, { refetchQueries: [{ query: GET_GAME, variables: { gameId } }] });
    const [setBeersMutation] = useMutation(SET_BEERS);
    const [setScoreMutation] = useMutation(SET_SCORE);
    const setBeers = async (playerId: string | number, beers: number) => {
        try {
            await setBeersMutation({ variables: { gameId, playerId, beers }});
            return true;
        } catch (e) {
            return false;
        }
    };
    const setScore = async (args: SetScoreArgs) => {
        await setScoreMutation({ variables: args });
    };
    const closeGame = async (reopen?: boolean) => {
        try {
            await closeGameMutation({ variables: { gameId, reopen }});
            return true;
        } catch (e) {
            return false;
        }
    };
    const isFinished = () => {
        if (!data?.getGame) return false;
        for (let i = 0; i < data?.getGame.pars.length; i++) {
            for (const scorecard of data.getGame.scorecards) {
                if (scorecard.scores[i] === undefined) return false;
            }
        }
        return true;
    };
    /* TODO
    const updateScorecardsCache = (scorecards: Scorecard[]) => {
    };
    */
    return {
        data: data?.getGame ?? null,
        ready: (!loading && !error),
        error,
        loading,
        setScore,
        closeGame,
        setBeers,
        isFinished
    };
};

export type Game = {
    id: string,
    course: string,
    layout: string,
    holes: number,
    pars: number[],
    date: string,
    startTime: number,
    endTime?: number,
    par: number,
    isOpen: boolean,
    scorecards: Scorecard[],
    myScorecard: Scorecard,
    layout_id: string,
}
export type Scorecard = {
    scores: number[],
    user: User,
    plusminus?: number,
    beers: number,
    total?: number,
    hc: number,
}

export type SetScoreArgs = {
    gameId: string,
    playerId: string,
    hole: number,
    value: number,
}
export default useGame;
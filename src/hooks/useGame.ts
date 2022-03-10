import { useMutation, useQuery } from "react-apollo";
import { LogBox } from "react-native";
import { SET_SCORE, CLOSE_GAME, SET_BEERS } from "../graphql/mutation";
import { GET_GAME } from "../graphql/queries";
import { updateScorecard } from "../utils/gameCahcheUpdates";
import { User } from "./useMe";

LogBox.ignoreLogs(['Setting a timer']);  // Hmm...

const useGame = (gameId: string) => {
    const { data, loading, error } = useQuery<{ getGame: Game }>(
        GET_GAME,
        {
            variables: { gameId },
            fetchPolicy: 'cache-and-network',
            pollInterval: (2000*60),      // Pollataan kahden minuutin välein kunnes subscriptionit
        });
    const [closeGameMutation] = useMutation(CLOSE_GAME, { refetchQueries: [{ query: GET_GAME, variables: { gameId } }] });
    const [setBeersMutation] = useMutation(SET_BEERS, {
        update: (cache, result) => updateScorecard(cache, gameId, result.data.setBeersDrank)
    });
    const [setScoreMutation] = useMutation(SET_SCORE, {
        refetchQueries: [
            { query: GET_GAME, variables: { gameId } }
        ]
    });
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
    const closeGame = async () => {
        try {
            await closeGameMutation({ variables: { gameId }});
            return true;
        } catch (e) {
            return false;
        }
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
    };
};

export type Game = {
    id: string,
    course: string,
    layout: string,
    holes: number,
    pars: number[],
    date: string,
    par: number,
    isOpen: boolean,
    scorecards: Scorecard[],
    myScorecard: Scorecard,
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
import { useMutation, useQuery } from "react-apollo";
import { SET_SCORE } from "../graphql/mutation";
import { GET_GAME } from "../graphql/queries";
import { User } from "./useMe";

const useGame = (gameId: string) => {
    const { data, loading, error } = useQuery<{ getGame: Game }>(GET_GAME, { variables: { gameId }, fetchPolicy: 'cache-and-network' })
    const [setScoreMutation] = useMutation(SET_SCORE, {
        refetchQueries: [
            { query: GET_GAME, variables: { gameId } }
        ]
    });

    const setScore = async (args: SetScoreArgs) => {
        const res = await setScoreMutation({ variables: args });
    }

    return {
        data: data?.getGame ?? null,
        ready: (!loading && !error),
        setScore,
    }
}

export type Game = {
    id: string,
    course: string,
    layout: string,
    holes: number,
    pars: number[],
    isOpen: boolean,
    scorecards: Scorecard[]
}
export type Scorecard = {
    scores: number[],
    user: User,
    total?: number,
}

export type SetScoreArgs = {
    gameId: string,
    playerId: string,
    hole: number,
    value: number,
}
export default useGame;
import { useQuery } from "react-apollo";
import { GET_GAME } from "../graphql/queries";
import { User } from "./useMe";

const useGame = (gameId: string) => {
    const { data, loading, error} = useQuery<{ getGame: Game }>(GET_GAME, { variables: { gameId }, fetchPolicy: 'cache-and-network' })

    return { 
        data: data?.getGame ?? null,
        ready: (!loading && !error)
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
    user: User
}
export default useGame;
import { ApolloError, WatchQueryFetchPolicy } from 'apollo-boost';
import { useEffect } from 'react';
import { useLazyQuery } from 'react-apollo';
import { GET_LAYOUT_STATS } from '../graphql/queries';

export default function useStats(layoutId: string | undefined, playersIds: string[], fetchPolicy?: WatchQueryFetchPolicy): StatsHook {

    const [getStats, { data, loading, error }] = useLazyQuery<RawStats>(GET_LAYOUT_STATS, { fetchPolicy: fetchPolicy || 'cache-first'});
    useEffect(() => {
        if (layoutId && playersIds?.length > 0) {
            getStats({
                variables: {
                    layoutId,
                    playersIds,
                },
            });
        }
    }, [layoutId]);
    /**
     * @param holeIndex 0 = first hole ;)
     **/
    const getStatsForHole = (playerId: string, holeIndex: number): SingleStats | undefined => {
        const card = data?.getLayoutStats?.find(card => card.playerId === playerId);
        if (!card) return;
        return card.holes.find(hole => hole.index === holeIndex);
    };
    return {
        loading,
        error,
        getStatsForHole
    };
}

export interface StatsHook {
    loading?: boolean,
    error?: ApolloError,
    getStatsForHole: (playerId: string, holeIndex: number) => SingleStats | undefined
}

interface RawStats {
    getLayoutStats: StatsCard[]
}
export type SingleStats = {
    index: number
    count: number
    best: number
    average: number
    eagle: number
    par: number
    birdie: number
    bogey: number
    doubleBogey: number
}
export type StatsCard = {
    games: number
    playerId: string
    holes: SingleStats[]
}
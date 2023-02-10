import { WatchQueryFetchPolicy } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_LAYOUT_STATS } from '../graphql/queries';

export default function useStats(
    layoutId: string | undefined,
    playersIds: string[],
    fetchPolicy?: WatchQueryFetchPolicy,
    altDeps?: unknown,
): StatsHook {
    const [getStats, { data, error, loading }] = useLazyQuery<RawStats>(GET_LAYOUT_STATS);
    useEffect(() => {
        if (layoutId && playersIds?.length > 0) {
            getStats({
                variables: {
                    layoutId,
                    playersIds,
                },
                fetchPolicy: fetchPolicy || 'cache-first'
            });
        }
    }, [layoutId, altDeps]);

    /**
     * @param holeIndex 0 = first hole ;)
     **/
    const getStatsForHole = (playerId: string, holeIndex: number): SingleStats | undefined => {
        const card = data?.getLayoutStats?.find(card => card.playerId === playerId);
        if (!card) {
            return;
        }
        return card.holes.find(hole => hole.index === holeIndex);
    };

    const getBest = (playerId: string | number) => {
        const card = data?.getLayoutStats?.find(card => card.playerId === playerId);
        return card?.best;
    };

    const getHc = (playerId: string | number) => {
        const card = data?.getLayoutStats?.find(card => card.playerId === playerId);
        return card?.hc;
    };

    return {
        getStatsForHole,
        getBest,
        getHc,
        error,
        loading
    };
}

export interface StatsHook {
    loading?: boolean,
    error?: unknown,
    getStatsForHole: (playerId: string, holeIndex: number) => SingleStats | undefined
    getBest: (playerId: string | number) => number | undefined,
    getHc: (playerId: string | number) => number | undefined,
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
    best: number
    hc: number
}
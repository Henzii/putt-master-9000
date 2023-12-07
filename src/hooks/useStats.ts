import { WatchQueryFetchPolicy } from '@apollo/client';
import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_LAYOUT_STATS } from '../graphql/queries';
import { SingleStats, StatsCard } from '../types/stats';

export default function useStats(
    layoutId: string | undefined,
    playersIds: string[],
    fetchPolicy?: WatchQueryFetchPolicy,
    altDeps?: unknown,
) {
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

    const getStatsForHole = (playerId: string, holeIndex: number): SingleStats | undefined => {
        const card = data?.getLayoutStats?.find(card => card.playerId === playerId);
        if (!card) {
            return;
        }
        return card.holes.find(hole => hole.index === holeIndex);
    };

    const getField = (playerId: string | number, field: keyof StatsCard) => {
        const card = data?.getLayoutStats?.find(card => card.playerId === playerId);
        if (!card) return;
        return card[field];
    };
    const getBest = (playerId: string | number) => {
        const card = data?.getLayoutStats?.find(card => card.playerId === playerId);
        return card?.best;
    };

    const getHc = (playerId: string | number) => {
        const card = data?.getLayoutStats?.find(card => card.playerId === playerId);
        return card?.hc;
    };

    const getHolesStats = (playerId: string | number) => {
        const card = data?.getLayoutStats?.find(card => card.playerId === playerId);
        return card?.holes;
    };

    return {
        getHolesStats,
        getStatsForHole,
        getBest,
        getHc,
        getField,
        error,
        loading,
    };
}

interface RawStats {
    getLayoutStats: StatsCard[]
}

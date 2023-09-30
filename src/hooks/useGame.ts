import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { SET_SCORE, CLOSE_GAME, SET_BEERS } from "../graphql/mutation";
import { GET_GAME, GET_LAYOUT } from "../graphql/queries";
import { useEffect } from 'react';
import { cacheUpdateUserScores } from '../utils/gameCahcheUpdates';
import { useDispatch } from 'react-redux';
import { addNotification } from '../reducers/notificationReducer';
import type { Game, GetGameResponse, SetScoreArgs } from '../types/game';
import { Layout } from '../types/course';

const useGame = (gameId: string) => {
    const { data, loading, error } = useQuery<GetGameResponse>(
        GET_GAME,
        {
            variables: { gameId },
            fetchPolicy: 'cache-and-network',
        });
    const [getLayoutInfo, { data: layout }] = useLazyQuery<{getLayout: Layout}>(GET_LAYOUT);
    const [closeGameMutation] = useMutation(CLOSE_GAME, { refetchQueries: [{ query: GET_GAME, variables: { gameId } }] });
    const [setBeersMutation] = useMutation(SET_BEERS);
    const [setScoreMutation] = useMutation<{setScore: Game}>(SET_SCORE, {errorPolicy: 'all'});
    const dispatch = useDispatch();

    useEffect(() => {
        if (data?.getGame.layout_id) {
            getLayoutInfo({ variables: { layoutId: data.getGame.layout_id }, fetchPolicy: 'cache-first' });
        }
    }, [data?.getGame.layout_id]);

    const setBeers = async (playerId: string | number, beers: number) => {
        try {
            await setBeersMutation({ variables: { gameId, playerId, beers }});
            return true;
        } catch (e) {
            return false;
        }
    };
    const setScore = async (args: SetScoreArgs) => {
        try {
            const response = await setScoreMutation({ variables: args });
            const {scores, plusminus} = response.data?.setScore.scorecards.find(sc => sc.user.id === args.playerId) ?? {};
            if (!scores) throw new Error();
            cacheUpdateUserScores({
                playerId: args.playerId,
                gameId: args.gameId,
                scorecard: {
                    scores,
                    plusminus
                }
            });
            return true;
        } catch (e) {
            dispatch(addNotification(`Error! Result might not have been saved :/`, 'alert'));
            return false;
        }
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

    return {
        data: data?.getGame ?? null,
        ready: (!loading && !error),
        error,
        loading,
        layout: layout?.getLayout ?? null,
        setScore,
        closeGame,
        setBeers,
        isFinished
    };
};

export default useGame;
import { useQuery } from "@apollo/client";
import { useCallback } from "react";
import { GET_GAME } from "src/graphql/queries";
import { Game } from "src/types/game";
import { useGameStore } from "src/zustand/gameStore";

export const useHoleMapUpload = () => {
    const [gameId, selectedRound] = useGameStore(state => [state.gameId, state.selectedRound]);
    const {data} = useQuery<{getGame: Game}>(GET_GAME, {variables: {gameId}, skip: !gameId, fetchPolicy: 'cache-first'});

    const game = data?.getGame;

    const uploadImage = useCallback(() => {
        if (game) {
            console.log(game.layout_id, selectedRound);
        } else {
            console.error("Game not found or not loaded", gameId);
        }
    }, [selectedRound, game]);

    return uploadImage;
};

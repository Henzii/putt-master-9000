import { Game } from "../../types/game";

export const getCompletedHoles = (game: Game) => {
    const holes = game.holes;
    let completedHoles = 0;
    for (let i = 0; i < holes; i++) {
        completedHoles += game.scorecards.every(sc => sc.scores?.[i]) ? 1 : 0;
    }

   return completedHoles;
};
import { Game, Scorecard } from "../../../types/game";

export const calculateTotalWithHc = (scorecard: Scorecard, game: Game) =>
    (scorecard.total ?? 0) - scorecard.hc - scorecard.beers * 0.5 * (game.bHcMultiplier ?? 1);
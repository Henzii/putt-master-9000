import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

type GameStore = {
    selectedRound: number
    gameId: string | undefined
    setSelectedRound: (round: number) => void
    setGameId: (gameId: string | undefined) => void
}

export const useGameStore = createWithEqualityFn<GameStore>()((set) => ({
    selectedRound: 0,
    gameId: undefined,
    setSelectedRound: (round: number) => set({
        selectedRound: round
    }),
    setGameId: (gameId: string | undefined) => set({
        gameId: gameId
    })

}), shallow);
import type { SafeUser } from "./user";

export type Game = {
    id: string,
    course: string,
    layout: string,
    holes: number,
    pars: number[],
    date: string,
    startTime: number,
    endTime?: number,
    par: number,
    isOpen: boolean,
    scorecards: Scorecard[],
    myScorecard: Scorecard,
    layout_id: string,
    groupName?: string,
    bHcMultiplier: number
}
export type Scorecard = {
    scores: number[],
    user: SafeUser,
    plusminus?: number,
    beers: number,
    total?: number,
    hc: number,
}

export type SetScoreArgs = {
    gameId: string,
    playerId: string,
    hole: number,
    value: number,
}

export type GetGameResponse = { getGame: Game }

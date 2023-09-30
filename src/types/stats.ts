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

import { SafeUser } from "./user";

export type RagePuttScorecard = {
    id: string;
    user: SafeUser;
    scores: number[];
    points: number | null
}

export type RagePuttGame = {
    id: string;
    startTime: string;
    endTime: string;
    isFinished: boolean;
    mode: RagePuttGameMode;
    scorecards: RagePuttScorecard[];
}

export type RagePuttGameMode = "default" | "quick";

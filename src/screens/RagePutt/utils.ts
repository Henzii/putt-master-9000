export type PuttingPercentage = {
    percentage: number;
    madePutts: number;
    attempts: number;
};

export type PuttingPercentages = Partial<Record<number, PuttingPercentage>>;

export const getPuttingPercentages = (scores: number[]): PuttingPercentages => {
    const madePuttsByDistance: Partial<Record<number, number>> = {};
    const attemptsByDistance: Partial<Record<number, number>> = {};
    let distance = 10;

    scores.forEach((score) => {
        if (!Number.isInteger(score) || score < 0 || score > 5) {
            return;
        }

        madePuttsByDistance[distance] = (madePuttsByDistance[distance] ?? 0) + score;
        attemptsByDistance[distance] = (attemptsByDistance[distance] ?? 0) + 5;
        distance = 5 + score;
    });

    return Object.fromEntries(
        Object.keys(attemptsByDistance).map((puttDistance) => {
            const distance = Number(puttDistance);
            const attempts = attemptsByDistance[distance] ?? 0;
            const madePutts = madePuttsByDistance[distance] ?? 0;
            return [puttDistance, {
                percentage: attempts === 0 ? 0 : (madePutts / attempts) * 100,
                madePutts,
                attempts,
            }];
        })
    );
};

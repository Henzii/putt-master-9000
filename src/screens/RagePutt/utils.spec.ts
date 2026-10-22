import { getPuttingPercentages } from "./utils";

describe("getPuttingPercentages", () => {
    it("calculates made-putt percentages by distance", () => {
        expect(getPuttingPercentages([4, 4, 0, 1])).toEqual({
            10: { percentage: 80, madePutts: 4, attempts: 5 },
            9: { percentage: 40, madePutts: 4, attempts: 10 },
            5: { percentage: 20, madePutts: 1, attempts: 5 },
        });
    });

    it("returns no percentages for scores without rounds", () => {
        expect(getPuttingPercentages([])).toEqual({});
    });
});

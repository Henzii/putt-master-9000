import { Point } from "src/types/throws";
import { createWithEqualityFn } from "zustand/traditional";

type Store = {
  startingPoint?: Point;
  setStartingPoint: (point: Point | undefined) => void;
  landingPoint?: Point;
  setLandingPoint: (point: Point | undefined) => void;
};

export const useMeasurementsStore = createWithEqualityFn<Store>((set) => ({
  setStartingPoint: (point) => set({ startingPoint: point }),
  setLandingPoint: (point) => set({ landingPoint: point }),
}));

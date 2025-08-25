export type Point = {
  coordinates: [number, number];
  acc: number;
};

export type MeasuredThrow = {
  startingPoint: Point;
  landingPoint: Point;
  createdAt: Date;
};

export type Point = {
  coordinates: [number, number];
  acc: number;
};

export type MeasuredThrow = {
  id: string;
  startingPoint: Point;
  landingPoint: Point;
  createdAt: Date;
};

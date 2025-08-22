export type Point = {
  lat: number;
  lon: number;
  acc: number;
};

export type Measurement = {
  startingPoint: Point;
  landingPoint: Point;
};

export type SavedMeasurement = Measurement & {
  timestamp: string;
};

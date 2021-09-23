import { Point } from "./customTypes";

export default function closestPair(points: Point[]): Point[] {
  const duplicatedPointOrNull = getDuplicatePointOrNull(points);

  if (duplicatedPointOrNull) {
    return [[...duplicatedPointOrNull], [...duplicatedPointOrNull]];
  }

  const pointsSortedByX = points
    .map((point: Point): Point => [...point])
    .sort(([x1], [x2]) => x1 - x2);

  const pointsSortedByY = points
    .map((point: Point): Point => [...point])
    .sort(([, y1], [, y2]) => y1 - y2);

  const n: number = points.length;

  const xLeftHalf: Point[] = pointsSortedByX.slice(0, Math.ceil(n / 2) - 1); //?

  const xRightHalf: Point[] = pointsSortedByX.slice(Math.ceil(n / 2) - 1);

  const median: Point = pointsSortedByX[Math.ceil(n / 2) - 1];

  const yLeftHalf: Point[] = pointsSortedByY.slice(0, Math.ceil(n / 2) - 1); //?

  const yRightHalf: Point[] = pointsSortedByY.slice(Math.ceil(n / 2) - 1);

  return points;
}

function getDuplicatePointOrNull(points: Point[]): Point | null {
  const stringifiedPoints = points
    .map((point: Point): Point => [...point])
    .map((point) => `${point[0].toString()}x${point[1].toString()}`);

  const duplicatePointOrNull = stringifiedPoints.reduce(
    (acc, item, index, array): string[] => {
      if (index !== array.lastIndexOf(item)) return [...acc, item];
      else return acc;
    },
    []
  );

  return duplicatePointOrNull.length > 0
    ? duplicatePointOrNull[0].split("x").map((eachPoint) => parseInt(eachPoint))
    : null;
}

export function getDistance(p1: Point, p2: Point): number {
  if (p1[0] === p2[0]) {
    return Math.abs(p1[1] - p2[1]);
  }

  if (p1[1] === p2[1]) {
    return Math.abs(p1[0] - p2[0]);
  }

  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

closestPair([
  [2, 2], // A
  [2, 8], // B
  [5, 5], // C
  [6, 3], // D
  [6, 7], // E
  [7, 4], // F
  [7, 9], // G
]);

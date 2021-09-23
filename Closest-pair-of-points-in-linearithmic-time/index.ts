import { Point } from "./customTypes";

export default function closestPair(points: Point[]): Point[] {
  const duplicatedPointOrNull = getDuplicatePointOrNull(points);

  if (duplicatedPointOrNull) {
    return [[...duplicatedPointOrNull], [...duplicatedPointOrNull]];
  }

  const pointsSortedByX = points
    .map((point: Point): Point => [...point])
    .sort(([x1], [x2]) => x1 - x2);

  const n: number = points.length;

  const xLeftHalf: Point[] = pointsSortedByX.slice(0, Math.ceil(n / 2) - 1); //?

  const xRightHalf: Point[] = pointsSortedByX.slice(Math.ceil(n / 2) - 1);

  const median: Point = pointsSortedByX[Math.ceil(n / 2) - 1];

  interface MinDistanceWithPoints {
    p1: Point;
    p2: Point;
    minDistance: number;
  }

  const xLeftMin: MinDistanceWithPoints = {
    p1: xLeftHalf[0],
    p2: xLeftHalf[1],
    minDistance: Infinity,
  };

  for (let i = 0; i < xLeftHalf.length - 1; i++) {
    const p1Candidate: Point = xLeftHalf[i];

    for (let j = i + 1; j < xLeftHalf.length; j++) {
      const p2Candidate: Point = xLeftHalf[j];

      const minDistanceCandidate: number = getDistance(
        p1Candidate,
        p2Candidate
      );

      if (minDistanceCandidate < xLeftMin.minDistance) {
        xLeftMin.minDistance = minDistanceCandidate;
        xLeftMin.p1 = p1Candidate;
        xLeftMin.p2 = p2Candidate;
      }
    }
  }

  const xRightMin: MinDistanceWithPoints = {
    p1: xRightHalf[0],
    p2: xRightHalf[1],
    minDistance: Infinity,
  };

  for (let i = 0; i < xRightHalf.length - 1; i++) {
    const p1Candidate: Point = xRightHalf[i];

    for (let j = i + 1; j < xRightHalf.length; j++) {
      const p2Candidate: Point = xRightHalf[j];

      const minDistanceCandidate: number = getDistance(
        p1Candidate,
        p2Candidate
      );

      if (minDistanceCandidate < xRightMin.minDistance) {
        xRightMin.minDistance = minDistanceCandidate;
        xRightMin.p1 = p1Candidate;
        xRightMin.p2 = p2Candidate;
      }
    }
  }

  let minDistance = Math.min(xLeftMin.minDistance, xRightMin.minDistance);

  let closestPoints: Point[] =
    minDistance === xLeftMin.minDistance
      ? [xLeftMin.p1, xLeftMin.p2]
      : [xRightMin.p1, xRightMin.p2];

  const strip: Point[] = pointsSortedByX.filter(
    ([x]) => Math.abs(x - median[0]) < minDistance
  );

  const stripSortedByY = strip
    .map((point: Point): Point => [...point])
    .sort(([, y1], [, y2]) => y1 - y2);

  for (let i = 0; i < stripSortedByY.length; ++i) {
    for (
      let j = i + 1;
      j < stripSortedByY.length &&
      stripSortedByY[j][1] - stripSortedByY[i][1] < minDistance;
      ++j
    ) {
      if (getDistance(stripSortedByY[i], stripSortedByY[j]) < minDistance) {
        minDistance = getDistance(stripSortedByY[i], stripSortedByY[j]);
        closestPoints = [stripSortedByY[i], stripSortedByY[j]];
      }
    }
  }

  return closestPoints;
}

function getDuplicatePointOrNull(points: Point[]): Point | null {
  const stringifiedPoints = points
    .map((point: Point): Point => [...point])
    .map((point) => `${point[0].toString()}x${point[1].toString()}`);

  const duplicatePointOrNull = stringifiedPoints.reduce(
    (acc, item, index, array) => {
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

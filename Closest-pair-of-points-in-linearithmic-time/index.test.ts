import closestPair from ".";
import { Point } from "./customTypes";
import "./jest-matchers/toEqualPoints";

const testPoints: Point[] = [
  [2, 2], // A
  [2, 8], // B
  [5, 5], // C
  [6, 3], // D
  [6, 7], // E
  [7, 4], // F
  [7, 9], // G
];

expect.extend({
  toEqualPoints(
    received: Point[],
    expected: Point[]
  ): jest.CustomMatcherResult {
    const pass: boolean = received.every(
      (point, index) =>
        point[0] === expected[index][0] && point[1] === expected[index][1]
    );

    const message: () => string = () =>
      pass ? "Arrays differ." : "Arrays of points are identical";

    return { pass, message };
  },
});

it("returns unmodified array", () => {
  expect(closestPair(testPoints)).toEqual(testPoints);
});

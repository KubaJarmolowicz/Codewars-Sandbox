import closestPair, { getDistance } from "./index";
import { Point } from "./customTypes";

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

describe("getDistance tests", () => {
  it("Tests if the function works for points with same X coordinate", () => {
    expect(getDistance([1, 2], [1, 5])).toBe(3);
  });

  it("Tests if the function works for points with same Y coordinate", () => {
    expect(getDistance([7, 5], [18, 5])).toBe(11);
  });

  it("Tests if the function works for points with different X and Y coordinates", () => {
    expect(getDistance([2, -6], [7, 3])).toBe(Math.sqrt(106));
  });
});

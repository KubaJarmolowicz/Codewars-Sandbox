import { Point } from "./customTypes";

declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualPoints(expected: Point[]): R;
    }
  }
}

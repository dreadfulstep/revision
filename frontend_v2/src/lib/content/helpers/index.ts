import {
  primeFactors,
  gcd,
  lcm,
  isPrime,
} from "./number";
import { round, clamp, nthRoot, sign, hcf, percentChange, simplifyFraction, hypotenuse, compound, triangleArea, circleArea, circumference, tanDeg, cosDeg, sinDeg, asinDeg, acosDeg, atanDeg } from "./math";

export type HelperFn = (...args: number[]) => number | string;

export const helpers: Record<string, HelperFn> = {
  primeFactors,
  gcd,
  lcm,
  hcf,
  isPrime,
  simplifyFraction,
  percentChange,
  compound,
  hypotenuse,
  triangleArea,
  circleArea,
  circumference,
  round,
  clamp,
  nthRoot,
  sign,
  sinDeg,
  cosDeg,
  tanDeg,
  asinDeg,
  acosDeg,
  atanDeg,
};

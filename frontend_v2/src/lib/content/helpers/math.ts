import { gcd } from "./number";

export function round(n: number, dp: number): number {
  return parseFloat(n.toFixed(dp));
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

export function nthRoot(x: number, n: number): number {
  return Math.pow(x, 1 / n);
}

export function log(x: number, base = Math.E): number {
  return Math.log(x) / Math.log(base);
}

export function sign(x: number): number {
  return x > 0 ? 1 : x < 0 ? -1 : 0;
}

export function hcf(a: number, b: number): number {
  return gcd(a, b);
}

export function simplifyFraction(num: number, den: number): string {
  const g = gcd(Math.abs(num), Math.abs(den));
  return `${num / g}/${den / g}`;
}

export function percentChange(original: number, newVal: number): number {
  return parseFloat((((newVal - original) / original) * 100).toFixed(2));
}

export function compound(
  principal: number,
  rate: number,
  years: number,
): number {
  return parseFloat((principal * Math.pow(1 + rate / 100, years)).toFixed(2));
}

export function triangleArea(b: number, h: number): number {
  return 0.5 * b * h;
}

export function circleArea(r: number): number {
  return parseFloat((Math.PI * r * r).toFixed(4));
}

export function circumference(r: number): number {
  return parseFloat((2 * Math.PI * r).toFixed(4));
}

export function hypotenuse(a: number, b: number): number {
  return parseFloat(Math.sqrt(a * a + b * b).toFixed(4));
}

export function sinDeg(deg: number): number {
  return parseFloat(Math.sin((deg * Math.PI) / 180).toFixed(6));
}

export function cosDeg(deg: number): number {
  return parseFloat(Math.cos((deg * Math.PI) / 180).toFixed(6));
}

export function tanDeg(deg: number): number {
  return parseFloat(Math.tan((deg * Math.PI) / 180).toFixed(6));
}

export function asinDeg(x: number): number {
  return parseFloat(((Math.asin(x) * 180) / Math.PI).toFixed(4));
}

export function acosDeg(x: number): number {
  return parseFloat(((Math.acos(x) * 180) / Math.PI).toFixed(4));
}

export function atanDeg(x: number): number {
  return parseFloat(((Math.atan(x) * 180) / Math.PI).toFixed(4));
}

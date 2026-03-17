export function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

export function isPrime(n: number): number {
  if (n < 2) return 0;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return 0;
  }
  return 1;
}

export function primeFactors(n: number): string {
  const counts: Record<number, number> = {};
  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) {
      counts[d] = (counts[d] ?? 0) + 1;
      n = Math.floor(n / d);
    }
    d++;
  }
  if (n > 1) counts[n] = (counts[n] ?? 0) + 1;
  return Object.entries(counts)
    .map(([base, exp]) => exp > 1 ? `${base}^${exp}` : base)
    .join(" × ");
}
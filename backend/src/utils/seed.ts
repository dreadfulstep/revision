function rng(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedArray<T>(array: T[], seed: string): T[] {
  const random = rng(djb2(seed));
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) + hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function generateSeed(subjectId: string): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const random = Array.from({ length: 16 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  return `${subjectId}-${random}`;
}
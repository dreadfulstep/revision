export type Rank = {
  title: string;
  minLevel: number;
  colour: string;
};

export const RANKS: Rank[] = [
  { title: "Novice",      minLevel: 1,  colour: "#94a3b8" },
  { title: "Apprentice",  minLevel: 5,  colour: "#22c55e" },
  { title: "Scholar",     minLevel: 10, colour: "#3b82f6" },
  { title: "Academic",    minLevel: 20, colour: "#8b5cf6" },
  { title: "Expert",      minLevel: 35, colour: "#f59e0b" },
  { title: "Master",      minLevel: 50, colour: "#ef4444" },
  { title: "Grandmaster", minLevel: 75, colour: "#ec4899" },
  { title: "Legend",      minLevel: 100, colour: "#f97316" },
];

export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(50 * Math.pow(level - 1, 1.4));
}

export function xpToNextLevel(level: number): number {
  return xpForLevel(level + 1) - xpForLevel(level);
}

export function levelFromXp(xp: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;
  return level;
}

export function xpProgress(xp: number): number {
  const level = levelFromXp(xp);
  const current = xp - xpForLevel(level);
  const needed = xpToNextLevel(level);
  if (needed === 0) return 1;
  return Math.min(current / needed, 1);
}

export function xpInLevel(xp: number): { current: number; needed: number } {
  const level = levelFromXp(xp);
  return {
    current: xp - xpForLevel(level),
    needed: xpToNextLevel(level),
  };
}

export function getRank(level: number): Rank {
  let rank = RANKS[0]!;
  for (const r of RANKS) {
    if (level >= r.minLevel) rank = r;
  }
  return rank;
}

export const XP_VALUES = {
  correctAnswer:   10,
  incorrectAnswer: 2,
  quizComplete:    25,
  perfectQuiz:     50, // bonus for 100%
  dailyStreak:     30,
} as const;
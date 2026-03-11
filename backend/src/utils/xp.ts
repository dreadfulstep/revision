const LEVEL_NAMES = [
  { name: "Beginner", icon: "🌱" },
  { name: "Learner", icon: "📖" },
  { name: "Student", icon: "✏️" },
  { name: "Scholar", icon: "🎓" },
  { name: "Expert", icon: "🔬" },
  { name: "Master", icon: "⭐" },
  { name: "Legend", icon: "🏆" },
];

export type LevelInfo = {
  level: number;
  name: string;
  icon: string;
  currentXp: number;
  thisLevelXp: number;
  nextLevelXp: number;
  xpIntoLevel: number;
  xpNeeded: number;
  progress: number;
  isMaxLevel: boolean;
  nextLevel?: {
    name: string;
    icon: string;
  };
};

export function calculateXP(score: number, questionCount: number, streakDays: number): number {
  const base = questionCount * 10;
  const scoreBonus = Math.round((score / 100) * questionCount * 15);
  const streakBonus = Math.min(streakDays * 5, 50);
  return base + scoreBonus + streakBonus;
}

export function getLevel(xp: number): LevelInfo {
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const thisLevelXp = Math.pow(level - 1, 2) * 100;
  const nextLevelXp = Math.pow(level, 2) * 100;
  const xpIntoLevel = xp - thisLevelXp;
  const xpNeeded = nextLevelXp - xp;
  const progress = Math.round((xpIntoLevel / (nextLevelXp - thisLevelXp)) * 100);

  const levelData = LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)];
  const nextLevelData = LEVEL_NAMES[Math.min(level, LEVEL_NAMES.length - 1)];
  const isMaxLevel = level >= LEVEL_NAMES.length;

  return {
    level,
    name: levelData.name,
    icon: levelData.icon,
    currentXp: xp,
    thisLevelXp,
    nextLevelXp,
    xpIntoLevel,
    xpNeeded: isMaxLevel ? 0 : xpNeeded,
    progress: isMaxLevel ? 100 : progress,
    isMaxLevel,
    nextLevel: isMaxLevel ? undefined : {
      name: nextLevelData.name,
      icon: nextLevelData.icon,
    },
  };
}

export function getLevelThresholds(): { level: number; name: string; icon: string; xpRequired: number }[] {
  return LEVEL_NAMES.map((l, i) => ({
    level: i + 1,
    name: l.name,
    icon: l.icon,
    xpRequired: Math.pow(i, 2) * 100,
  }));
}

export function getXPBreakdown(score: number, questionCount: number, streakDays: number) {
  const base = questionCount * 10;
  const scoreBonus = Math.round((score / 100) * questionCount * 15);
  const streakBonus = Math.min(streakDays * 5, 50);
  return {
    base,
    scoreBonus,
    streakBonus,
    total: base + scoreBonus + streakBonus,
  };
}
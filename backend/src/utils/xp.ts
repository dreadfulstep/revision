export function calculateXP(score: number, questionCount: number, streakDays: number): number {
  const base = questionCount * 10;
  const scoreBonus = Math.round((score / 100) * questionCount * 15);
  const streakBonus = Math.min(streakDays * 5, 50);
  return base + scoreBonus + streakBonus;
}

export function getLevel(xp: number) {
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const thisLevelXp = Math.pow(level - 1, 2) * 100;
  const nextLevelXp = Math.pow(level, 2) * 100;
  const progress = Math.round(((xp - thisLevelXp) / (nextLevelXp - thisLevelXp)) * 100);
  return { level, currentXp: xp, nextLevelXp, progress };
}

export function getLevelName(level: number): string {
  const names = ["Beginner", "Learner", "Student", "Scholar", "Expert", "Master"];
  return names[Math.min(level - 1, names.length - 1)];
}
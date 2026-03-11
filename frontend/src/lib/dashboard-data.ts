import { serverApi } from "@/lib/server-api";

export type DiscordUser = {
  id: string;
  username: string;
  avatar?: string | null;
  banner?: string | null;
  public_flags: number;
  flags: number;
  global_name: string | null;
  email?: string | null;
};

export interface Streak {
  current: number;
  longest: number;
  lastActivityDate: Date;
}

export interface LevelInfo {
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
}

export interface UserStats {
  xp: number;
  level: LevelInfo;
  quizzesCompleted: number;
  questionsAnswered: number;
  streak: {
    current: number;
    longest: number;
  };
  accuracy: number;
}

export interface Topic {
  id: string;
  name: string;
  questionCount: number;
}

export interface Subject {
  id: string;
  name: string;
  examBoard: string;
  tier: string;
  colour: string;
  papers: string[];
  topics: Topic[];
  questionCount: number;
}

export interface History {
  attemptId: string;
  seed: string;
  subjectId: string;
  subjectName: string;
  topics: string[];
  duration?: number;
  questionsAnswered: number;
  accuracy: number;
  completedAt: Date;
}

export interface DashboardData {
  user: DiscordUser | null;
  streak: Streak;
  stats?: UserStats;
  subjects?: Subject[];
  history?: History[];
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const [user, streak, stats, subjects, history] = await Promise.all([
      serverApi.me.get() as Promise<DiscordUser | null>,
      serverApi.me.getStreak() as Promise<Streak>,
      serverApi.me.getStats?.() as Promise<UserStats | undefined>,
      serverApi.subjects.getAll?.() as Promise<Subject[] | []>,
      serverApi.me.getHistory?.() as Promise<History[] | undefined>,
    ]);

    return {
      user,
      streak,
      stats,
      subjects,
      history,
    };
  } catch (err) {
    console.error("Dashboard fetch failed", err);
    return {
      user: null,
      streak: { current: 0, longest: 0, lastActivityDate: new Date() },
      stats: undefined,
      subjects: [],
      history: [],
    };
  }
}
import db from "@/db";
import { users } from "@/db/tables/users";
import { eq, desc, and, gte } from "drizzle-orm";
import { getLevel } from "@/utils/xp";

type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string };

type LeaderboardEntry = {
  rank: number;
  userId: string;
  username: string;
  avatar: string | null;
  xp: number;
  level: number;
  levelName: string;
  levelIcon: string;
  quizzesCompleted: number;
};

type UserRank = {
  rank: number;
  entry: LeaderboardEntry;
};

export async function getLeaderboard(): Promise<ServiceResult<LeaderboardEntry[]>> {
  const top = await db
    .select({
      id: users.id,
      username: users.username,
      avatar: users.avatar,
      xp: users.xp,
      quizzesCompleted: users.quizzesCompleted,
    })
    .from(users)
    .orderBy(desc(users.xp))
    .limit(50);

  const entries = top.map((user, i) => {
    const levelInfo = getLevel(user.xp);
    return {
      rank: i + 1,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      xp: user.xp,
      level: levelInfo.level,
      levelName: levelInfo.name,
      levelIcon: levelInfo.icon,
      quizzesCompleted: user.quizzesCompleted,
    };
  });

  return { ok: true, data: entries };
}

export async function getUserRank(userId: string): Promise<ServiceResult<UserRank>> {
  // get all users ordered by xp, find position of this user
  const all = await db
    .select({ id: users.id, xp: users.xp })
    .from(users)
    .orderBy(desc(users.xp));

  const index = all.findIndex((u) => u.id === userId);
  if (index === -1) return { ok: false, status: 404, error: "User not found" };

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
    .then((r) => r[0]);

  const levelInfo = getLevel(user.xp);

  return {
    ok: true,
    data: {
      rank: index + 1,
      entry: {
        rank: index + 1,
        userId: user.id,
        username: user.username,
        avatar: user.avatar,
        xp: user.xp,
        level: levelInfo.level,
        levelName: levelInfo.name,
        levelIcon: levelInfo.icon,
        quizzesCompleted: user.quizzesCompleted,
      },
    },
  };
}
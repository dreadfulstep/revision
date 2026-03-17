import { db } from "@/lib/db";
import { users, quizAttempts, accounts } from "@/lib/db/schema";
import { Trophy } from "lucide-react";
import Image from "next/image";
import { sql, desc, eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

type LeaderboardEntry = {
  rank: number;
  userId: string;
  username: string;
  avatar: string | null;
  provider: string;
  providerUserId: string;
  xp: number;
  level: number;
  levelName: string;
  quizzesCompleted: number;
};

function getAvatarUrl(entry: LeaderboardEntry, size = 128) {
  const { provider, providerUserId, avatar } = entry;

  if (provider === "discord") {
    if (avatar) {
      return avatar;
    }
    const index = Number((BigInt(providerUserId) >> BigInt(22)) % BigInt(6));
    return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
  }

  if (provider === "github") {
    return avatar ?? `https://avatars.githubusercontent.com/u/${providerUserId}?s=${size}`;
  }

  return `https://cdn.discordapp.com/embed/avatars/0.png`;
}

function Avatar({ entry, size = 40 }: { entry: LeaderboardEntry; size?: number }) {
  return (
    <Image
      src={getAvatarUrl(entry, size * 2)}
      width={size}
      height={size}
      alt={entry.username}
      className="rounded-full shrink-0 object-cover"
      style={{ width: size, height: size }}
    />
  );
}

async function getLeaderboardData(): Promise<LeaderboardEntry[]> {
  const usersData = await db
    .select({
      id: users.id,
      username: users.username,
      avatar: users.avatar,
      xp: users.xp,
      level: users.level,
      provider: accounts.provider,
      providerUserId: accounts.providerUserId,
      quizzesCompleted: sql<number>`(
        SELECT COUNT(*) 
        FROM ${quizAttempts} 
        WHERE ${quizAttempts.userId} = ${users.id} 
          AND ${quizAttempts.status} = 'completed'
      )`,
    })
    .from(users)
    .leftJoin(accounts, eq(users.id, accounts.userId))
    .orderBy(desc(users.xp))
    .limit(50);

  return usersData.map((u, i) => ({
    rank: i + 1,
    userId: u.id,
    username: u.username,
    avatar: u.avatar,
    provider: u.provider ?? "discord",
    providerUserId: u.providerUserId ?? u.id,
    xp: u.xp,
    level: u.level,
    levelName: `Level ${u.level}`,
    quizzesCompleted: u.quizzesCompleted,
  }));
}

export default async function LeaderboardPage() {
  const currentUser = await getSession();
  const entries = await getLeaderboardData();

  const myEntry = entries.find((e) => e.userId === currentUser?.id);
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const podiumOrder = [top3[1], top3[0], top3[2]];
  
  const MIN_LIST_ROWS = 3;
  const listPlaceholders = Math.max(0, MIN_LIST_ROWS - rest.length);

  return (
    <div className="px-4 md:px-8 py-6 max-w-md md:max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
          <Trophy size={16} className="text-primary" />
        </div>
        <h1 className="text-xl font-bold">Leaderboard</h1>
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:max-w-lg md:mx-auto">
        {podiumOrder.map((entry, visualIndex) => {
          if (!entry) return <PodiumPlaceholder key={visualIndex} visualIndex={visualIndex} />;
          
          const medals = ["🥈", "🥇", "🥉"];
          const isFirst = visualIndex === 1;
          const isMe = currentUser && entry.userId === currentUser.id;

          return (
            <div
              key={entry.userId}
              className={`rounded-2xl border p-4 flex flex-col items-center text-center gap-2 transition-all ${
                isFirst ? "border-yellow-500/30 bg-yellow-500/5" : 
                isMe ? "border-primary/30 bg-primary/5" : "border-border bg-card"
              }`}
            >
              <span className="text-2xl">{medals[visualIndex]}</span>
              <Avatar entry={entry} size={40} />
              <div className="min-w-0 w-full">
                <p className="text-xs font-semibold truncate">{isMe ? "You" : entry.username}</p>
                <p className="text-[10px] text-muted-foreground">{entry.levelName}</p>
              </div>
              <p className="text-xs font-bold text-primary">{entry.xp.toLocaleString()} XP</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden mb-4">
        <div className="flex flex-col">
          {rest.map((entry, i) => {
            const isMe = currentUser && entry.userId === currentUser.id;
            return (
              <div
                key={entry.userId}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  isMe ? "bg-primary/5" : "hover:bg-accent/50"
                } ${i !== rest.length - 1 || listPlaceholders > 0 ? "border-b border-border" : ""}`}
              >
                <span className="text-xs text-muted-foreground w-5 text-right tabular-nums">{entry.rank}</span>
                <Avatar entry={entry} size={32} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{isMe ? "You" : entry.username}</p>
                  <p className="text-xs text-muted-foreground">{entry.levelName}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-primary">{entry.xp.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">{entry.quizzesCompleted} quizzes</p>
                </div>
              </div>
            );
          })}
          {Array.from({ length: listPlaceholders }).map((_, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i !== listPlaceholders - 1 ? "border-b border-border" : ""}`}>
               <div className="w-5 h-2 bg-muted rounded shrink-0" />
               <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
               <div className="h-3 w-24 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>

      {myEntry && myEntry.rank > entries.length && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3.5 flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-5 text-right tabular-nums">#{myEntry.rank}</span>
          <Avatar entry={myEntry} size={32} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">You</p>
            <p className="text-xs text-muted-foreground">{myEntry.levelName}</p>
          </div>
          <p className="text-sm font-semibold text-primary">{myEntry.xp.toLocaleString()} XP</p>
        </div>
      )}
    </div>
  );
}

function PodiumPlaceholder({ visualIndex }: { visualIndex: number }) {
  const medals = ["🥈", "🥇", "🥉"];
  return (
    <div className="rounded-2xl border-2 border-dashed border-border p-4 flex flex-col items-center text-center gap-2 opacity-50">
      <span className="text-2xl">{medals[visualIndex]}</span>
      <div className="w-10 h-10 rounded-full border-2 border-dashed border-border" />
      <div className="h-3 w-12 bg-muted rounded animate-pulse" />
    </div>
  );
}
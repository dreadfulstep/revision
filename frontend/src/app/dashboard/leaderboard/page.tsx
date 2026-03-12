"use client";
import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { api } from "@/lib/api";
import { useUser } from "@/components/providers/user-provider";
import Image from "next/image";

type Entry = {
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

type MyRank = {
  rank: number;
  entry: Entry;
};

function getAvatarUrl(userId: string, avatar: string | null, size = 64) {
  if (avatar) {
    return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png?size=${size}`;
  }
  const index = Number((BigInt(userId) >> BigInt(22)) % BigInt(6));
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}

function Avatar({
  userId,
  avatar,
  username,
  size = 40,
}: {
  userId: string;
  avatar: string | null;
  username: string;
  size?: number;
}) {
  return (
    <Image
      src={getAvatarUrl(userId, avatar, size * 2)}
      width={size}
      height={size}
      alt={username}
      className="rounded-full shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

const MIN_LIST_ROWS = 3;

export default function Leaderboard() {
  const currentUser = useUser();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [myRank, setMyRank] = useState<MyRank | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (
      Promise.all([
        api.leaderboard.getAll(),
        api.leaderboard.getMyRank(),
      ]) as Promise<[Entry[], MyRank | null]>
    )
      .then(([all, me]) => {
        setEntries(all);
        setMyRank(me);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  const podiumOrder = [top3[1], top3[0], top3[2]];

  const listEntries = rest;
  const listPlaceholders = Math.max(0, MIN_LIST_ROWS - rest.length);

  const myRankInPodium = myRank && myRank.rank <= 3;

  return (
    <div className="px-4 md:px-8 py-6 max-w-md md:max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-yellow-500/10">
          <Trophy size={16} className="text-yellow-500" />
        </div>
        <h1 className="text-xl font-bold">Leaderboard</h1>
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:max-w-lg md:mx-auto">
        {podiumOrder.map((entry, visualIndex) => {
          const medals = ["🥈", "🥇", "🥉"];
          const isFirst = visualIndex === 1;
          const isMe = entry && currentUser && entry.userId === currentUser.id;

          if (!entry) {
            return (
              <div
                key={`placeholder-${visualIndex}`}
                className="rounded-2xl border-2 border-dashed border-border p-4 flex flex-col items-center text-center gap-2"
              >
                <span className="text-2xl opacity-30">
                  {medals[visualIndex]}
                </span>
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-border" />
                <div className="space-y-1">
                  <div className="h-2.5 w-12 rounded-full bg-muted mx-auto" />
                  <div className="h-2 w-8 rounded-full bg-muted mx-auto" />
                </div>
                <div className="h-3 w-14 rounded-full bg-muted" />
              </div>
            );
          }

          return (
            <div
              key={entry.userId}
              className={`rounded-2xl border p-4 flex flex-col items-center text-center gap-2 transition-all ${
                isFirst
                  ? "border-yellow-500/30 bg-yellow-500/5"
                  : isMe
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-card"
              }`}
            >
              <span className="text-2xl">{medals[visualIndex]}</span>
              <Avatar
                userId={entry.userId}
                avatar={entry.avatar}
                username={entry.username}
                size={40}
              />
              <div>
                <p className="text-xs font-semibold truncate max-w-18">
                  {isMe ? "You" : entry.username}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {entry.levelIcon} {entry.levelName}
                </p>
              </div>
              <p className="text-xs font-bold text-primary">
                {entry.xp.toLocaleString()} XP
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden mb-4">
        <div className="md:grid md:grid-cols-2 md:divide-x md:divide-border">
          <div>
            {listEntries.map((entry, i) => {
              const isMe = currentUser && entry.userId === currentUser.id;
              const isLast =
                i === listEntries.length - 1 && listPlaceholders === 0;
              return (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                    isMe ? "bg-primary/5" : "hover:bg-accent"
                  } ${!isLast ? "border-b border-border" : ""}`}
                >
                  <span className="text-xs text-muted-foreground w-5 text-right shrink-0 tabular-nums">
                    {entry.rank}
                  </span>
                  <Avatar
                    userId={entry.userId}
                    avatar={entry.avatar}
                    username={entry.username}
                    size={28}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {isMe ? "You" : entry.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entry.levelIcon} {entry.levelName}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-primary">
                      {entry.xp.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entry.quizzesCompleted} quizzes
                    </p>
                  </div>
                </div>
              );
            })}

            {Array.from({ length: listPlaceholders }).map((_, i) => (
              <div
                key={`list-placeholder-${i}`}
                className={`flex items-center gap-3 px-4 py-3 ${i !== listPlaceholders - 1 ? "border-b border-border" : ""}`}
              >
                <div className="w-5 h-2.5 rounded-full bg-muted shrink-0" />
                <div className="w-7 h-7 rounded-full border-2 border-dashed border-border shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 w-20 rounded-full bg-muted" />
                  <div className="h-2 w-12 rounded-full bg-muted" />
                </div>
                <div className="space-y-1.5 items-end flex flex-col">
                  <div className="h-2.5 w-12 rounded-full bg-muted" />
                  <div className="h-2 w-10 rounded-full bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {myRank && !myRankInPodium && myRank.rank > entries.length && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3.5 flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-5 text-right shrink-0 tabular-nums">
            #{myRank.rank}
          </span>
          <Avatar
            userId={myRank.entry.userId}
            avatar={myRank.entry.avatar}
            username={myRank.entry.username}
            size={28}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">You</p>
            <p className="text-xs text-muted-foreground">
              {myRank.entry.levelIcon} {myRank.entry.levelName}
            </p>
          </div>
          <p className="text-sm font-semibold text-primary">
            {myRank.entry.xp.toLocaleString()} XP
          </p>
        </div>
      )}
    </div>
  );
}

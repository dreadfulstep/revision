"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trophy } from "lucide-react";
import { api } from "@/lib/api";

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

export default function Leaderboard() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [myRank, setMyRank] = useState<MyRank | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.leaderboard.getAll(),
      api.leaderboard.getMyRank(),
    ])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(([all, me]: any) => {
        setEntries(all);
        setMyRank(me);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div
        className="fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-125 h-75 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Dashboard
        </button>

        <div className="flex items-center gap-2 mb-8">
          <Trophy size={18} className="text-yellow-400" />
          <h1 className="text-xl font-semibold">Leaderboard</h1>
        </div>

        {/* Top 3 podium */}
        {top3.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[top3[1], top3[0], top3[2]].map((entry, visualIndex) => {
              if (!entry) return <div key={visualIndex} />;
              const isFirst = entry.rank === 1;
              const medals = ["🥈", "🥇", "🥉"];
              return (
                <div
                  key={entry.userId}
                  className={`rounded-2xl border p-4 flex flex-col items-center text-center gap-2 ${
                    isFirst
                      ? "border-yellow-500/30 bg-yellow-500/5"
                      : "border-zinc-800 bg-zinc-900/30"
                  }`}
                >
                  <span className="text-2xl">{medals[visualIndex]}</span>
                  {entry.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://cdn.discordapp.com/avatars/${entry.userId}/${entry.avatar}.png?size=64`}
                      className="w-10 h-10 rounded-full"
                      alt={entry.username}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold">
                      {entry.username[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold truncate max-w-20">{entry.username}</p>
                    <p className="text-xs text-zinc-500">{entry.levelIcon} {entry.levelName}</p>
                  </div>
                  <p className="text-sm font-bold text-indigo-400">{entry.xp.toLocaleString()} XP</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Rest of leaderboard */}
        {rest.length > 0 && (
          <div className="rounded-2xl border border-zinc-800 overflow-hidden mb-6">
            {rest.map((entry, i) => (
              <div
                key={entry.userId}
                className={`flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-900/50 transition-colors ${
                  i !== rest.length - 1 ? "border-b border-zinc-800/50" : ""
                }`}
              >
                <span className="text-sm text-zinc-600 w-6 text-right shrink-0">
                  {entry.rank}
                </span>
                {entry.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`https://cdn.discordapp.com/avatars/${entry.userId}/${entry.avatar}.png?size=32`}
                    className="w-7 h-7 rounded-full shrink-0"
                    alt={entry.username}
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold shrink-0">
                    {entry.username[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{entry.username}</p>
                  <p className="text-xs text-zinc-600">{entry.levelIcon} {entry.levelName}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-indigo-400">{entry.xp.toLocaleString()}</p>
                  <p className="text-xs text-zinc-600">{entry.quizzesCompleted} quizzes</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Your rank sticky */}
        {myRank && (
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 px-5 py-4 flex items-center gap-4">
            <span className="text-sm text-zinc-400 w-6 text-right shrink-0">#{myRank.rank}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">You</p>
              <p className="text-xs text-zinc-500">{myRank.entry.levelIcon} {myRank.entry.levelName}</p>
            </div>
            <p className="text-sm font-semibold text-indigo-400">{myRank.entry.xp.toLocaleString()} XP</p>
          </div>
        )}
      </div>
    </div>
  );
}
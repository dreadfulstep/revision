"use client";
import { useState } from "react";
import { openAuthPopup } from "@/lib/auth";
import { FaDiscord } from "react-icons/fa";
import {
  Zap,
  Flame,
  Trophy,
  BookOpen,
  TrendingUp,
  CalendarDays,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/navbar";

const features = [
  {
    icon: Zap,
    colour: "text-yellow-500",
    bg: "bg-yellow-500/10",
    title: "Instant feedback",
    desc: "Know immediately if you got it right, with full explanations after every answer.",
  },
  {
    icon: Flame,
    colour: "text-orange-500",
    bg: "bg-orange-500/10",
    title: "Daily streaks",
    desc: "Build a revision habit that sticks. Your streak grows every day you complete a quiz.",
  },
  {
    icon: Trophy,
    colour: "text-amber-500",
    bg: "bg-amber-500/10",
    title: "Leaderboard",
    desc: "Earn XP, level up, and compete with classmates for the top spot.",
  },
  {
    icon: BookOpen,
    colour: "text-primary",
    bg: "bg-primary/10",
    title: "Shareable seeds",
    desc: "Every quiz has a seed, share it so friends attempt the exact same questions.",
  },
  {
    icon: TrendingUp,
    colour: "text-blue-500",
    bg: "bg-blue-500/10",
    title: "Predicted grades",
    desc: "Track performance over time and see your predicted grade per subject.",
  },
  {
    icon: CalendarDays,
    colour: "text-pink-500",
    bg: "bg-pink-500/10",
    title: "Exam countdown",
    desc: "Your upcoming exams in one place so you always know what to revise next.",
  },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setLoading(true);
    setError(null);
    try {
      await openAuthPopup();
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      if ((err as Error).message !== "Popup closed")
        setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-15 left-1/2 -translate-x-1/2 h-100 w-150 rounded-full bg-primary/6 blur-[120px]" />{" "}
      </div>

      <Navbar handleLogin={handleLogin} loading={loading} />

      <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 max-w-4xl mx-auto">
        <Badge
          variant="secondary"
          className="rounded-full mb-6 gap-1.5 px-4 py-1.5 text-xs font-medium border"
        >
          <Sparkles size={11} className="text-primary" />
          Free for all students
        </Badge>
        <h1 className="text-5xl sm:text-[4.5rem] font-bold tracking-tight leading-[1.06] mb-6">
          Revise smarter,
          <br />
          <span className="text-primary">score higher.</span>
        </h1>
        <p className="text-muted-foreground text-xl max-w-md mb-9 leading-relaxed">
          Seeded quizzes, instant feedback, streaks and predicted grades;
          everything you need to ace your GCSEs.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-5">
          <Button
            size="lg"
            className="rounded-full cursor-pointer gap-2.5 px-8 py-5 font-semibold shadow-lg shadow-primary/25 text-base"
            onClick={handleLogin}
            disabled={loading}
          >
            <FaDiscord size={17} />
            {loading ? "Connecting..." : "Continue with Discord"}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="rounded-full text-muted-foreground text-base"
            asChild
          >
            <a href="#features">
              Learn more
              <ArrowRight size={15} />
            </a>
          </Button>
        </div>
        {error && <p className="text-destructive text-sm mb-3">{error}</p>}
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          Sign in with Discord: takes 10 seconds, no setup needed
        </p>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 pb-28">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2.5">Everything in one place</h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
            Built around how students actually revise, not how teachers think
            they should.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, colour, bg, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border bg-card p-6 flex flex-col gap-4 hover:shadow-sm hover:border-primary/25 transition-all duration-200 cursor-default"
            >
              <div
                className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}
              >
                <Icon size={19} className={colour} />
              </div>
              <div>
                <h3 className="text-md font-semibold mb-1.5">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="rounded-3xl bg-primary/6 border border-primary/15 px-10 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold mb-1.5">
              Ready to start revising?
            </h2>
            <p className="text-muted-foreground text-sm">
              Free forever. Sign in with Discord and start in seconds.
            </p>
          </div>
          <Button
            size="lg"
            className="rounded-full gap-2.5 shrink-0 px-7 shadow-lg shadow-primary/20 font-semibold"
            onClick={handleLogin}
            disabled={loading}
          >
            <FaDiscord size={16} />
            Get started free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <Zap size={9} className="text-primary-foreground" />
            </div>
            <span className="font-medium text-foreground">RevisionPal</span>
          </div>
          <p>Built for GCSE students · Free forever</p>
        </div>
      </footer>
    </div>
  );
}

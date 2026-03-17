import Link from "next/link";
import { FaDiscord, FaGithub } from "react-icons/fa";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16 pb-8 relative overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

        <div className="text-center space-y-3 relative">
          <h1 className="text-4xl font-bold tracking-tight leading-none">
            Revise smarter.
          </h1>
          <h2 className="text-4xl font-bold tracking-tight leading-none text-primary">
            Score higher.
          </h2>
          <p className="text-md text-muted-foreground mt-4 max-w-62.5 mx-auto leading-relaxed">
            Practice questions, track your progress, and compete with friends, all in one place.
          </p>
        </div>
      </div>

      <div className="px-6 pb-10 pt-6 space-y-3">
        <Link href="/api/auth/discord"
          className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl bg-[#5865F2] hover:bg-[#4752c4] active:scale-[0.98] transition-all text-white font-semibold text-base shadow-lg shadow-[#5865F2]/20">
          <FaDiscord size={22} />
          <span className="flex-1">Continue with Discord</span>
          <span className="text-white/50 text-sm">→</span>
        </Link>

        <Link href="/api/auth/github"
          className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl bg-foreground hover:opacity-90 active:scale-[0.98] transition-all text-background font-semibold text-base shadow-lg shadow-foreground/10">
          <FaGithub size={22} />
          <span className="flex-1">Continue with GitHub</span>
          <span className="text-background/40 text-sm">→</span>
        </Link>

        <p className="text-[11px] text-muted-foreground/60 text-center pt-2 leading-relaxed">
          By signing in you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
            Terms
          </Link>
          {" "}and{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>

    </div>
  );
}
"use client";
import { openAuthPopup } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen } from "lucide-react";
import { FaDiscord } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      await openAuthPopup();
      router.push("/dashboard");
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      {/* Subtle background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <BookOpen size={24} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to continue revising</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border bg-card p-6 space-y-4">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-60 text-white font-semibold py-3 text-sm transition-all shadow-md shadow-[#5865F2]/20"
          >
            {loading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <FaDiscord size={18} />
            )}
            {loading ? "Signing in…" : "Continue with Discord"}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            By signing in you agree to our{" "}
            <a href="/terms" className="underline underline-offset-2 hover:text-foreground transition-colors">
              terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">
              privacy policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
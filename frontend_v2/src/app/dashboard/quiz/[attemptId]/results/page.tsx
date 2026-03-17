import { getSession } from "@/lib/auth";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  Trophy,
  ArrowLeft,
  LayoutDashboard,
  Zap,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RetakeButton } from "./RetakeButton";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const cookieStore = await cookies();
  const { attemptId } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/quiz/${attemptId}/results`,
    {
      headers: {
        Cookie: `session=${cookieStore.get("session")?.value}`,
      },
    },
  );

  if (!res.ok) redirect("/dashboard");
  const data = await res.json();

  const isSuccess = data.percentage >= 70;
  const isMedal = data.percentage >= 90;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 max-w-2xl mx-auto flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-muted-foreground"
        >
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Exit to Dashboard
          </Link>
        </Button>
      </div>

      <main className="max-w-xl mx-auto px-4 space-y-6">
        <Card className="border-none bg-linear-to-b from-primary/10 via-background to-background shadow-none text-center pt-8">
          <CardHeader className="space-y-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              {isMedal ? (
                <Trophy className="h-10 w-10 text-primary" />
              ) : (
                <CheckCircle2 className="h-10 w-10 text-primary" />
              )}
            </div>
            <div className="space-y-1">
              <CardTitle className="text-4xl font-black tracking-tight">
                {data.percentage}%
              </CardTitle>
              <CardDescription className="text-base font-medium">
                {isMedal
                  ? "Incredible work, Scholar!"
                  : isSuccess
                    ? "Solid performance!"
                    : "Keep at it, you're getting there!"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Progress
              value={data.percentage}
              className="h-3 w-full max-w-xs mx-auto"
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                <Target size={20} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase">
                  Accuracy
                </p>
                <p className="text-lg font-bold">
                  {data.correct}/{data.total}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600">
                <Zap size={20} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase">
                  XP Gained
                </p>
                <p className="text-lg font-bold">
                  +{data.totalXp ?? data.correct * 10}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center justify-between">
              Next Level Progress
              <span className="text-primary font-black uppercase text-[10px] tracking-widest">
                Level {data.userLevel ?? 1}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-xs font-medium opacity-70">
              <span>{data.currentLevelXp ?? 0} XP</span>
              <span>{data.xpToNextLevel ?? 1000} XP</span>
            </div>
            <Progress value={45} className="h-2" />
          </CardContent>
        </Card>

        <div className="space-y-3 pt-4">
          <Button
            asChild
            className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20"
          >
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Finish Attempt
            </Link>
          </Button>
          <RetakeButton attemptId={attemptId} />
        </div>
      </main>
    </div>
  );
}

import { SidebarInset } from "@/components/ui/sidebar";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { StreakCard } from "@/components/dashboard/streak-card";
import { LevelProgressCard } from "@/components/dashboard/level-progress-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { SubjectsGrid } from "@/components/dashboard/subjects-grid";
import { TopBar } from "@/components/dashboard/top-bar";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="flex min-h-svh w-full">
      <SidebarInset className="flex flex-col pb-20 md:pb-0">
        <TopBar />

        <main className="flex-1 overflow-auto">
          <div className="mx-auto px-4 py-6 space-y-6">
            <section className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-balance">
                Welcome back, {data.user?.global_name}
              </h1>
              <p className="text-muted-foreground text-sm">
                {"You're making great progress! Keep it up."}
              </p>
            </section>

            <div className="grid gap-4 md:grid-cols-2">
              <LevelProgressCard stats={data.stats} />
              <StreakCard streak={data.streak} />
            </div>

            <StatsOverview stats={data.stats} />

            {/* <PerformanceChart /> */}

            <SubjectsGrid subjects={data.subjects || []}/>

            <RecentActivity history={data.history || []}/>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}

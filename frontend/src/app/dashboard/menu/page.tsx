"use client";
import { useUser } from "@/components/providers/user-provider";
import Link from "next/link";
import {
  LayoutDashboard,
  Trophy,
  History,
  Timer,
  ChevronRight,
  Plus,
  BarChart3,
} from "lucide-react";
import Image from "next/image";

const sections = [
  {
    title: "Study",
    items: [
      {
        href: "/dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
        description: "Your overview",
      },
      {
        href: "/dashboard/create",
        icon: Plus,
        label: "New Quiz",
        description: "Start a quiz",
      },
      {
        href: "/dashboard/history",
        icon: History,
        label: "History",
        description: "Past attempts",
      },
      {
        href: "/dashboard/timer",
        icon: Timer,
        label: "Timer",
        description: "Pomodoro & stopwatch",
      },
    ],
  },
  {
    title: "Progress",
    items: [
      {
        href: "/dashboard/statistics",
        icon: BarChart3,
        label: "Statistics",
        description: "Your performance",
      },
      {
        href: "/dashboard/leaderboard",
        icon: Trophy,
        label: "Leaderboard",
        description: "Rankings",
      },
    ],
  },
];

export default function MenuPage() {
  const user = useUser();

  const avatar = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(user!.id) >> BigInt(22)) % BigInt(6))}.png`;

  return (
    <div className="px-4 py-6 max-w-md mx-auto w-full space-y-6">
      <div className="flex items-center gap-3.5 rounded-2xl border bg-card px-4 py-4">
        {user?.avatar ? (
          <Image
            src={avatar}
            alt={user.username}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-base font-bold text-primary">
              {user?.username?.[0]?.toUpperCase() ?? "?"}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">
            {user?.username ?? "Student"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">View profile</p>
        </div>
        <ChevronRight size={15} className="text-muted-foreground/40 shrink-0" />
      </div>

      {/* Nav sections */}
      {sections.map((section) => (
        <div key={section.title}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            {section.title}
          </p>
          <div className="rounded-2xl border bg-card overflow-hidden">
            {section.items.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3.5 hover:bg-accent transition-colors ${
                  i !== section.items.length - 1 ? "border-b" : ""
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <item.icon size={15} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <ChevronRight
                  size={13}
                  className="text-muted-foreground/30 shrink-0"
                />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

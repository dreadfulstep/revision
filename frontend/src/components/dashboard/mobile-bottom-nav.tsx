"use client";

import { Plus, Trophy, Home, Menu, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/dashboard/calendar", icon: Calendar, label: "Calendar" },
  { href: "/dashboard/create", icon: Plus, label: "Create", isCenter: true },
  { href: "/dashboard/leaderboard", icon: Trophy, label: "Leaderboard" },
  { href: "/dashboard/menu", icon: Menu, label: "Menu" },
];

export function MobileBottomNav({}) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-border" />

      <div className="relative flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isCenter = item.isCenter;

          if (isCenter) {
            return (
              <Link href={item.href} key={item.href}>
                <button
                  className="relative mt- gap-1.5 flex flex-col items-center"
                  aria-label="Create new quiz"
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30 transition-transform active:scale-95">
                    <Plus className="size-6 text-primary-foreground" />
                  </div>
                  <span className="mt-2. text-[10px] font-medium text-muted-foreground">
                    Create
                  </span>
                </button>
              </Link>
            );
          }

          return (
            <Link href={item.href} key={item.href}>
              <button
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
              >
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-xl transition-colors",
                    isActive && "bg-primary/10",
                  )}
                >
                  <item.icon
                    className={cn("size-5", isActive && "text-primary")}
                  />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

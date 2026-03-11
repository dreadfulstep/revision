"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useUser } from "../providers/user-provider";

export function TopBar() {
  const user = useUser();

  const avatar = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(user!.id) >> BigInt(22)) % BigInt(6))}.png`;

  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-background/80 backdrop-blur-xl px-4 py-3">
      <SidebarTrigger className="hidden md:flex rounded-lg" />

      <div className="flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search quizzes, subjects..."
            className="h-9 w-full rounded-xl bg-muted/50 pl-9 pr-4 text-sm outline-none ring-ring placeholder:text-muted-foreground focus:ring-2 transition-all"
            aria-label="Search"
          />
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-xl"
        aria-label="Notifications"
      >
        <Bell className="size-5" />
        <Badge
          className="absolute -top-1 -right-1 size-5 items-center justify-center rounded-full p-0 text-[10px]"
          aria-label="3 unread notifications"
        >
          3
        </Badge>
      </Button>

      <Avatar className="md:hidden size-8">
        <AvatarImage
          src={avatar}
          alt={`${user?.global_name}'s Avatar`}
        />
        <AvatarFallback>{user?.global_name?.slice(0, 1)}</AvatarFallback>
      </Avatar>
    </header>
  );
}

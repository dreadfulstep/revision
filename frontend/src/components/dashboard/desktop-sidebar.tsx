"use client"

import Link from "next/link"
import {
  LayoutDashboard,
  BarChart3,
  User,
  BookOpen,
  Trophy,
  History,
  Settings,
  LogOut,
  Zap,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

const mainNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/statistics", icon: BarChart3, label: "Statistics" },
  { href: "/subjects", icon: BookOpen, label: "Subjects" },
  { href: "/history", icon: History, label: "History" },
  { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
]

const accountNavItems = [
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

export function DesktopSidebar() {
  const pathname = usePathname();

  const getActivePath = (path: string) => path === pathname;

  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
      className="hidden md:flex border-none"
    >
      <SidebarHeader className="pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="rounded-xl">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary">
                  <Zap className="size-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">StudyBuddy</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <Button className="w-full gap-2 rounded-xl" size="sm">
              <Plus className="size-4" />
              <span>Create Quiz</span>
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={getActivePath(item.href)}
                    className="rounded-xl"
                    tooltip={item.label}
                  >
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={getActivePath(item.href)}
                    className="rounded-xl"
                    tooltip={item.label}
                  >
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="rounded-xl" tooltip="User profile">
              <Avatar className="size-6">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Alex" />
                <AvatarFallback>AX</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-xs">
                <span className="font-medium">Alex Chen</span>
                <span className="text-muted-foreground">Level 12</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              tooltip="Sign out"
            >
              <LogOut className="size-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

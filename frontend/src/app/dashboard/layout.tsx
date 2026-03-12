import { DesktopSidebar } from "@/components/dashboard/desktop-sidebar";
import { MobileBottomNav } from "@/components/dashboard/mobile-bottom-nav";
import { User, UserProvider } from "@/components/providers/user-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { serverApi } from "@/lib/server-api";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  const user = (await serverApi.me.get().catch(() => null)) as User;
  if (!user) redirect("/login");
  return (
    <UserProvider user={user}>
      <SidebarProvider>
        <DesktopSidebar />
        <SidebarInset className="pb-20">{children}</SidebarInset>
        <MobileBottomNav />
      </SidebarProvider>
    </UserProvider>
  );
};

export default Layout;

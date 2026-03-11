import { DesktopSidebar } from "@/components/dashboard/desktop-sidebar";
import { MobileBottomNav } from "@/components/dashboard/mobile-bottom-nav";
import { User, UserProvider } from "@/components/providers/user-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { serverApi } from "@/lib/server-api";
import { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  const user = (await serverApi.me.get().catch(() => null)) as User;
  return (
    <UserProvider user={user}>
      <SidebarProvider>
        <DesktopSidebar />
        {children}
        <MobileBottomNav />
      </SidebarProvider>
    </UserProvider>
  );
};

export default Layout;

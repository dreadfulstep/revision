import BottomNav from "@/components/dashboard/BottomNav";
import { DesktopSidebar } from "@/components/dashboard/DesktopSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <DesktopSidebar />
      <SidebarInset className="pb-20">{children}</SidebarInset>
      <BottomNav />
    </SidebarProvider>
  );
};

export default Layout;

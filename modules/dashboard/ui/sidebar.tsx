import { SidebarContent, SidebarGroup, SidebarMenu, SidebarSeparator } from "@/components/ui/sidebar";
import Modulos from "./modulos";

export function AppSidebar() {
  return (
    <SidebarContent className="pt-5 bg-primary text-background-foreground overflow-hidden max-h-1/2 min-h-7/8 ">
      <SidebarSeparator />
      <SidebarGroup className="h-full">
        <SidebarMenu className="space-y-0 overflow-y-auto min-h-7/8 ">
          <Modulos />
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
}

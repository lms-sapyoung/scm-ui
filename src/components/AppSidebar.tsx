import { Link, useLocation } from "react-router-dom";
import { Pencil, Home, List, Layers, BarChart2 } from "lucide-react";
import { CreateIssueDialog } from "@/components/CreateIssueDialog";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const items = [
  { title: "대시보드", url: "/", icon: Home },
  { title: "프로젝트", url: "/projects", icon: Layers },
  { title: "이슈", url: "/issues", icon: List },
  { title: "상태", url: "/status", icon: BarChart2 },
];

export function AppSidebar() {
  const location = useLocation();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col w-full items-center">
          <span className="text-lg font-bold tracking-tight py-2">llaputa</span>
          <div className="w-full border-b" />
        </div>
      </SidebarHeader>
      <SidebarMenuItem>
        <CreateIssueDialog projectId="default">
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium border hover:bg-muted hover:text-primary transition-colors">
            <Pencil className="w-4 h-4" />
            <span>새 이슈</span>
          </button>
        </CreateIssueDialog>
      </SidebarMenuItem>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={`flex items-center gap-2 px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === item.url
                          ? "bg-muted text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-primary"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

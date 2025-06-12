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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ProjectSelector, type Project } from "@/components/ProjectSelector"

const items = [
  { title: "대시보드", url: "/", icon: Home },
  { title: "프로젝트", url: "/projects", icon: Layers },
  { title: "이슈", url: "/issues", icon: List },
  { title: "상태", url: "/status", icon: BarChart2 },
];

interface AppSidebarProps {
  projects: Project[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
}

export function AppSidebar({ projects, selectedProjectId, setSelectedProjectId }: AppSidebarProps) {
  const location = useLocation();
  return (
    <Sidebar>
      <div className="relative">
        <SidebarHeader>
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-lg font-bold tracking-tight">llaputa</span>
          </div>
        </SidebarHeader>
        <SidebarTrigger className="absolute -right-3 top-4" />
      </div>
      <SidebarContent>
        <div className="px-2 pt-4">
          <div className="bg-white rounded-xl shadow flex items-center px-3 py-2 mb-4 border border-gray-100">
            <ProjectSelector
              projects={projects}
              value={selectedProjectId}
              onChange={setSelectedProjectId}
            />
          </div>
        </div>
        <div className="px-2 mb-6">
          <CreateIssueDialog projectId="default">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium border hover:bg-muted hover:text-primary transition-colors">
              <Pencil className="w-4 h-4" />
              <span>새 이슈</span>
            </button>
          </CreateIssueDialog>
        </div>
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

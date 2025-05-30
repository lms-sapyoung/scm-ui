import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Pencil, Home, List, Layers } from "lucide-react"
import { CreateIssueDialog } from "@/components/CreateIssueDialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navItems = [
  { to: "/", icon: <Home className="w-5 h-5 mr-2" />, label: "대시보드" },
  { to: "/projects", icon: <Layers className="w-5 h-5 mr-2" />, label: "프로젝트" },
  { to: "/issues", icon: <List className="w-5 h-5 mr-2" />, label: "이슈" },
]

export function Sidebar() {
  const location = useLocation();
  return (
    <aside className="h-screen w-48 flex flex-col bg-white border-r fixed left-0 top-0 z-40">
      <div className="flex-1 flex flex-col gap-1 mt-6">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-primary ${location.pathname === item.to ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>
      <div className="mb-6 px-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CreateIssueDialog projectId="default">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2" aria-label="새 이슈">
                  <Pencil className="w-4 h-4" />
                  <span className="text-sm">새 이슈</span>
                </Button>
              </CreateIssueDialog>
            </TooltipTrigger>
            <TooltipContent>새 이슈</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  )
} 
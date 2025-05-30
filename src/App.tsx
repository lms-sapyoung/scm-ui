import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Contents } from "@/components/Contents"
import { ProjectsPage } from "@/pages/ProjectsPage"
import IssuesPage from "@/pages/IssuesPage"
import { StatusPage } from "@/pages/StatusPage"
import IssueDetailPage from "@/pages/IssueDetailPage"
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { SiteHeader } from '@/components/SiteHeader'

export function App() {
  return (
    <SidebarProvider>
      <Router>
        <AppSidebar />
        <SidebarInset>
          <div className="relative">
            <SidebarTrigger />
            <SiteHeader />
          </div>
          <div className="flex flex-1 flex-col">
            <div className="min-h-screen bg-gray-50">
              <Contents>
                <Routes>
                  <Route path="/" element={<ProjectsPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/issues" element={<IssuesPage />} />
                  <Route path="/issues/:id" element={<IssueDetailPage />} />
                  <Route path="/status" element={<StatusPage />} />
                </Routes>
              </Contents>
            </div>
          </div>
        </SidebarInset>
      </Router>
    </SidebarProvider>
  )
}

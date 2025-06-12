import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Contents } from "@/components/Contents"
import { ProjectsPage } from "@/pages/ProjectsPage"
import IssuesPage from "@/pages/IssuesPage"
import StatusPage from "@/pages/StatusPage"
import IssueDetailPage from "@/pages/IssueDetailPage"
import DashboardPage from "@/pages/DashboardPage"
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { SiteHeader } from '@/components/SiteHeader'
import { ProjectSelector, type Project } from '@/components/ProjectSelector'

const mockProjects: Project[] = [
  { id: "1", name: "2024 신규 서비스" },
  { id: "2", name: "시스템 개선" },
]

export function App() {
  const [selectedProjectId, setSelectedProjectId] = useState(mockProjects[0].id)
  return (
    <SidebarProvider>
      <Router>
        <div className="flex h-screen">
          <AppSidebar projects={mockProjects} selectedProjectId={selectedProjectId} setSelectedProjectId={setSelectedProjectId} />
          <main className="flex-1 flex flex-col">
            <SiteHeader />
            <div className="flex-1 bg-gray-50">
              <Contents>
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/issues" element={<IssuesPage selectedProjectId={selectedProjectId} />} />
                  <Route path="/issues/:id" element={<IssueDetailPage />} />
                  <Route path="/status" element={<StatusPage selectedProjectId={selectedProjectId} />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Contents>
            </div>
          </main>
        </div>
      </Router>
    </SidebarProvider>
  )
}

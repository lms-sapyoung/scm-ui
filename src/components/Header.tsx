import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { CreateIssueDialog } from '@/components/CreateIssueDialog'
import { Pencil } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function Header() {
  const isLoggedIn = false // TODO: 실제 로그인 상태 관리로 대체 필요

  return (
    <header className="w-full p-4 border-b bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-xl font-bold">My App-CM</Link>
          <nav className="flex items-center space-x-4">
            <Link to="/projects" className="text-gray-600 hover:text-gray-900">프로젝트</Link>
            <Link to="/issues" className="text-gray-600 hover:text-gray-900">이슈</Link>
            <Link to="/status" className="text-gray-600 hover:text-gray-900">상태</Link>
          </nav>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant={isLoggedIn ? "outline" : "default"}
            onClick={() => console.log(isLoggedIn ? "로그아웃" : "로그인")}
          >
            {isLoggedIn ? "로그아웃" : "로그인"}
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CreateIssueDialog projectId="default">
                  <Button variant="ghost" size="icon" aria-label="새 이슈">
                    <Pencil className="w-5 h-5" />
                  </Button>
                </CreateIssueDialog>
              </TooltipTrigger>
              <TooltipContent>새 이슈</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  )
} 
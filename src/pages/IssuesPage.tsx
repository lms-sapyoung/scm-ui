import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import type { Issue, IssueFilter } from "@/types/issue"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CreateIssueDialog } from '@/components/CreateIssueDialog'

// 임시 데이터
export const mockIssues: Issue[] = [
  {
    id: "1",
    title: "로그인 기능 구현",
    description: "사용자 인증 및 로그인 기능 구현",
    projectId: "1",
    projectName: "프로젝트 A",
    reporter: {
      id: "1",
      name: "홍길동",
      email: "hong@example.com"
    },
    assignee: {
      id: "2",
      name: "김철수",
      email: "kim@example.com"
    },
    status: "in_progress",
    priority: "high",
    type: "feature",
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-16'),
    labels: ["frontend", "auth"],
    dueDate: new Date('2024-03-20'),
  },
  {
    id: "2",
    title: "버그 수정: 데이터 로딩 실패",
    description: "데이터 로딩 시 간헐적으로 발생하는 오류 수정",
    projectId: "1",
    projectName: "프로젝트 A",
    reporter: {
      id: "2",
      name: "김철수",
      email: "kim@example.com"
    },
    assignee: {
      id: "3",
      name: "이영희",
      email: "lee@example.com"
    },
    status: "open",
    priority: "medium",
    type: "bug",
    createdAt: new Date('2024-03-14'),
    updatedAt: new Date('2024-03-14'),
    labels: ["backend", "bug"],
    dueDate: new Date('2024-03-18'),
  },
  {
    id: "3",
    title: "UI 개선: 반응형 디자인",
    description: "모바일 환경에서의 UI 개선",
    projectId: "2",
    projectName: "프로젝트 B",
    reporter: {
      id: "3",
      name: "이영희",
      email: "lee@example.com"
    },
    assignee: {
      id: "1",
      name: "홍길동",
      email: "hong@example.com"
    },
    status: "resolved",
    priority: "low",
    type: "improvement",
    createdAt: new Date('2024-03-13'),
    updatedAt: new Date('2024-03-15'),
    labels: ["frontend", "ui"],
    dueDate: new Date('2024-03-17'),
  }
]

export default function IssuesPage() {
  const navigate = useNavigate()
  const [selectedIssues, setSelectedIssues] = useState<string[]>([])
  const [filter, setFilter] = useState<IssueFilter>({})
  const [issues] = useState(mockIssues)

  const handleSearch = (value: string) => {
    setFilter(prev => ({ ...prev, search: value }))
  }

  const handleStatusChange = (value: Issue['status']) => {
    setFilter(prev => ({ ...prev, status: value }))
  }

  const handlePriorityChange = (value: Issue['priority']) => {
    setFilter(prev => ({ ...prev, priority: value }))
  }

  const handleTypeChange = (value: Issue['type']) => {
    setFilter(prev => ({ ...prev, type: value }))
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIssues(mockIssues.map(i => i.id))
    } else {
      setSelectedIssues([])
    }
  }

  const handleSelectIssue = (issueId: string, checked: boolean) => {
    if (checked) {
      setSelectedIssues(prev => [...prev, issueId])
    } else {
      setSelectedIssues(prev => prev.filter(id => id !== issueId))
    }
  }

  const getStatusColor = (status: Issue['status']) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: Issue['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: Issue['type']) => {
    switch (type) {
      case 'bug':
        return 'bg-red-100 text-red-800'
      case 'feature':
        return 'bg-blue-100 text-blue-800'
      case 'task':
        return 'bg-purple-100 text-purple-800'
      case 'improvement':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleRowClick = (issueId: string) => {
    navigate(`/issues/${issueId}`)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">이슈</h1>
        <CreateIssueDialog projectId="1" />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="divide-y">
          {issues.map((issue) => (
            <Link
              key={issue.id}
              to={`/issues/${issue.id}`}
              className="block hover:bg-muted/50 transition-colors"
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">
                        {issue.type === 'bug' && '버그'}
                        {issue.type === 'feature' && '기능'}
                        {issue.type === 'task' && '작업'}
                        {issue.type === 'improvement' && '개선'}
                      </Badge>
                      <h2 className="text-lg font-medium truncate">{issue.title}</h2>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>#{issue.id}</span>
                      <span>
                        {issue.status === 'open' && '할 일'}
                        {issue.status === 'in_progress' && '진행중'}
                        {issue.status === 'resolved' && '검토중'}
                        {issue.status === 'closed' && '완료'}
                      </span>
                      <span>
                        {issue.priority === 'low' && '낮음'}
                        {issue.priority === 'medium' && '보통'}
                        {issue.priority === 'high' && '높음'}
                        {issue.priority === 'urgent' && '긴급'}
                      </span>
                      {issue.dueDate && (
                        <span>마감일: {format(issue.dueDate, 'yyyy-MM-dd')}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {issue.assignee && (
                      <Avatar>
                        <AvatarFallback>
                          {issue.assignee.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 
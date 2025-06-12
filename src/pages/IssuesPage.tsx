import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import type { Issue, IssueFilter } from "@/types/issue"
import { Checkbox } from "@/components/ui/checkbox"
import { format, differenceInCalendarDays, isBefore, isToday } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Bug, Wrench, Sparkles, CheckCircle, Search, User } from "lucide-react"
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

const typeMap = {
  bug: { icon: <Bug className="w-4 h-4 mr-1" />, color: "bg-red-100 text-red-700", label: "버그" },
  feature: { icon: <Sparkles className="w-4 h-4 mr-1" />, color: "bg-blue-100 text-blue-700", label: "기능" },
  improvement: { icon: <Wrench className="w-4 h-4 mr-1" />, color: "bg-green-100 text-green-700", label: "개선" },
  task: { icon: <CheckCircle className="w-4 h-4 mr-1" />, color: "bg-gray-100 text-gray-700", label: "작업" },
};

const priorityMap = {
  high: { icon: '🔴', label: '높음', color: 'text-red-600 font-bold' },
  medium: { icon: '🟠', label: '보통', color: 'text-yellow-600 font-semibold' },
  low: { icon: '🟢', label: '낮음', color: 'text-green-600 font-semibold' },
  urgent: { icon: '❗', label: '긴급', color: 'text-red-800 font-extrabold' },
};

const statusMap = [
  { value: '', label: '전체', color: 'bg-gray-100 text-gray-700' },
  { value: 'open', label: '할 일', color: 'bg-blue-100 text-blue-700' },
  { value: 'in_progress', label: '진행중', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'resolved', label: '검토중', color: 'bg-green-100 text-green-700' },
  { value: 'closed', label: '완료', color: 'bg-gray-200 text-gray-500' },
];

// Mock 데이터 예시
const currentUser = { id: '1', name: '홍길동' };
const userList = [
  { id: '1', name: '홍길동' },
  { id: '2', name: '김철수' },
  { id: '3', name: '이영희' },
];
// allIssues는 기존 mockIssues와 동일하게 사용한다고 가정
import { mockIssues as allIssues } from './IssuesPage';

interface IssuesPageProps {
  selectedProjectId: string;
}

export default function IssuesPage({ selectedProjectId }: IssuesPageProps) {
  const navigate = useNavigate()
  const [selectedIssues, setSelectedIssues] = useState<string[]>([])
  const [filter, setFilter] = useState<IssueFilter>({ assigneeId: currentUser.id })
  const [issues] = useState(allIssues)
  const [showClosed, setShowClosed] = useState(false)
  const [showOnlyMine, setShowOnlyMine] = useState(true)

  // 사용자 변경 핸들러
  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(prev => ({ ...prev, assigneeId: e.target.value }))
    setShowOnlyMine(e.target.value === currentUser.id)
  }

  // 내 이슈만 보기 토글
  const handleToggleMine = () => {
    if (showOnlyMine) {
      setFilter(prev => ({ ...prev, assigneeId: undefined }))
      setShowOnlyMine(false)
    } else {
      setFilter(prev => ({ ...prev, assigneeId: currentUser.id }))
      setShowOnlyMine(true)
    }
  }

  const handleSearch = (value: string) => {
    setFilter(prev => ({ ...prev, search: value }))
  }

  const handleStatusChange = (value: string) => {
    setFilter(prev => ({ ...prev, status: value === '' ? undefined : (value as Issue['status']) }))
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

  // 필터링된 이슈
  const filteredIssues = issues.filter(issue =>
    issue.projectId === selectedProjectId &&
    (!filter.status || issue.status === filter.status) &&
    (!filter.assigneeId || issue.assignee?.id === filter.assigneeId)
  )

  const openIssues = filteredIssues.filter(i => i.status !== 'closed')
  const closedIssues = filteredIssues.filter(i => i.status === 'closed')

  return (
    <div className="space-y-4 p-4">
      {/* 모던 필터/액션 영역 */}
      <div className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 border border-gray-100">
        <div className="flex flex-1 gap-3 items-center min-w-0">
          {/* 검색 인풋 */}
          <div className="relative w-full max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <Input
              placeholder="이슈 검색..."
              className="pl-9 text-sm rounded-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-primary"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          {/* 상태 세그먼트 버튼 */}
          <div className="flex gap-1 bg-gray-50 rounded-full px-1 py-1 border border-gray-100 shadow-inner">
            {statusMap.map((item) => (
              <button
                key={item.value}
                onClick={() => handleStatusChange(item.value)}
                className={`px-4 py-1 rounded-full text-sm font-medium transition flex items-center
                  ${filter.status === item.value || (!filter.status && item.value === '')
                    ? `${item.color} shadow ring-2 ring-primary`
                    : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-100'}`}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
          {/* 담당자 셀렉트 */}
          <div className="hidden md:block">
            <select
              className="border rounded-full px-3 py-1 text-sm bg-gray-50 focus:bg-white border-gray-200 focus:border-primary"
              value={filter.assigneeId || ''}
              onChange={handleUserChange}
            >
              {userList.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
              <option value="">전체 사용자</option>
            </select>
          </div>
        </div>
        {/* 액션 버튼 그룹 */}
        <div className="flex gap-2 items-center justify-end">
          <Button
            variant={showOnlyMine ? 'default' : 'outline'}
            size="sm"
            onClick={handleToggleMine}
            className="rounded-full px-4"
          >
            <User className="w-4 h-4 mr-1" />
            {showOnlyMine ? '내 이슈만' : '전체 이슈'}
          </Button>
          <CreateIssueDialog projectId="1">
            <Button className="rounded-full px-5 font-semibold shadow bg-primary text-white hover:bg-primary/90 transition">
              + 새 이슈 만들기
            </Button>
          </CreateIssueDialog>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="divide-y">
          {/* 오픈 이슈 */}
          {openIssues.map((issue) => (
            <Link
              key={issue.id}
              to={`/issues/${issue.id}`}
              className="block hover:bg-muted/50 transition-colors"
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`flex items-center ${typeMap[issue.type].color}`}>
                        {typeMap[issue.type].icon}
                        {typeMap[issue.type].label}
                      </Badge>
                      <h2 className="text-lg font-medium truncate">{issue.title}</h2>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{issue.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>#{issue.id}</span>
                      <span>
                        {issue.status === 'open' && '할 일'}
                        {issue.status === 'in_progress' && '진행중'}
                        {issue.status === 'resolved' && '검토중'}
                        {issue.status === 'closed' && '완료'}
                      </span>
                      <span className={`flex items-center gap-1 ${priorityMap[issue.priority].color}`}>
                        <span>{priorityMap[issue.priority].icon}</span>
                        <span>{priorityMap[issue.priority].label}</span>
                      </span>
                      {issue.dueDate && (
                        (() => {
                          const days = differenceInCalendarDays(issue.dueDate, new Date());
                          if (isBefore(issue.dueDate, new Date())) {
                            return <span className="text-red-600 font-bold">지연 (D+{Math.abs(days)})</span>;
                          }
                          if (isToday(issue.dueDate)) {
                            return <span className="text-orange-500 font-bold">D-day</span>;
                          }
                          return <span className="text-gray-500">D-{days}</span>;
                        })()
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

          {/* 완료 이슈 아코디언 */}
          {closedIssues.length > 0 && (
            <div>
              <button
                className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-medium flex items-center gap-2"
                onClick={() => setShowClosed((v) => !v)}
              >
                <span>{showClosed ? '▼' : '▶'}</span>
                <span>완료된 이슈 {closedIssues.length}개 {showClosed ? '접기' : '펼치기'}</span>
              </button>
              {showClosed && closedIssues.map((issue) => (
                <Link
                  key={issue.id}
                  to={`/issues/${issue.id}`}
                  className="block hover:bg-muted/50 transition-colors"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={`flex items-center ${typeMap[issue.type].color}`}>
                            {typeMap[issue.type].icon}
                            {typeMap[issue.type].label}
                          </Badge>
                          <h2 className="text-lg font-medium truncate">{issue.title}</h2>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{issue.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>#{issue.id}</span>
                          <span>
                            {issue.status === 'open' && '할 일'}
                            {issue.status === 'in_progress' && '진행중'}
                            {issue.status === 'resolved' && '검토중'}
                            {issue.status === 'closed' && '완료'}
                          </span>
                          <span className={`flex items-center gap-1 ${priorityMap[issue.priority].color}`}>
                            <span>{priorityMap[issue.priority].icon}</span>
                            <span>{priorityMap[issue.priority].label}</span>
                          </span>
                          {issue.dueDate && (
                            (() => {
                              const days = differenceInCalendarDays(issue.dueDate, new Date());
                              if (isBefore(issue.dueDate, new Date())) {
                                return <span className="text-red-600 font-bold">지연 (D+{Math.abs(days)})</span>;
                              }
                              if (isToday(issue.dueDate)) {
                                return <span className="text-orange-500 font-bold">D-day</span>;
                              }
                              return <span className="text-gray-500">D-{days}</span>;
                            })()
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
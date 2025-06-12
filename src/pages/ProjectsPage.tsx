import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Project, ProjectFilter } from "@/types/project"
import { Checkbox } from "@/components/ui/checkbox"
import { Search } from "lucide-react"
import { Progress } from "@/components/ui/Progress"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

// 임시 데이터
const mockProjects: (Project & { progress: number })[] = [
  {
    id: "1",
    name: "2024 신규 서비스 개발",
    description: "신규 서비스 개발 프로젝트",
    owner: {
      id: "1",
      name: "홍길동",
      email: "hong@example.com"
    },
    status: "active",
    createdAt: "2024-03-20",
    updatedAt: "2024-03-20",
    members: [
      { id: "1", name: "홍길동", role: "admin" },
      { id: "2", name: "김철수", role: "member" }
    ],
    tags: ["신규", "서비스"],
    progress: 35
  },
  {
    id: "2",
    name: "시스템 개선 프로젝트",
    description: "기존 시스템 성능 개선",
    owner: {
      id: "2",
      name: "김철수",
      email: "kim@example.com"
    },
    status: "completed",
    createdAt: "2024-03-19",
    updatedAt: "2024-03-20",
    members: [
      { id: "2", name: "김철수", role: "admin" }
    ],
    tags: ["개선", "시스템"],
    progress: 100
  }
]

function Pagination({ page, total, onPageChange }: { page: number, total: number, onPageChange: (p: number) => void }) {
  let pages: (number | string)[] = [];
  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages = [1];
    if (page > 3) pages.push('...');
    const centerPages = [page - 1, page, page + 1].filter(
      p => p > 1 && p < total
    );
    pages.push(...centerPages);
    if (page < total - 2) pages.push('...');
    if (total !== 1) pages.push(total);
    // 중복 제거
    pages = pages.filter((p, i) => pages.indexOf(p) === i);
  }
  return (
    <div className="flex justify-center items-center gap-1">
      <Button variant="outline" size="sm" onClick={() => onPageChange(1)} disabled={page === 1}>{'≪'}</Button>
      <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page === 1}>이전</Button>
      {pages.map((p, i) =>
        typeof p === 'number' ? (
          <Button
            key={p}
            variant={p === page ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(p)}
            className={p === page ? 'font-bold' : ''}
          >
            {p}
          </Button>
        ) : (
          <span key={i} className="px-2 text-gray-400">...</span>
        )
      )}
      <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page === total}>다음</Button>
      <Button variant="outline" size="sm" onClick={() => onPageChange(total)} disabled={page === total}>{'≫'}</Button>
    </div>
  );
}

export function ProjectsPage() {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [filter, setFilter] = useState<ProjectFilter>({})
  const [page, setPage] = useState(1)
  const totalPages = 7 // 예시용, 실제 데이터에 맞게 변경 가능

  const handleSearch = (value: string) => {
    setFilter(prev => ({ ...prev, search: value }))
  }

  const handleStatusChange = (value: string) => {
    setFilter(prev => ({
      ...prev,
      status: value === '' ? undefined : (value as Project['status'])
    }))
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProjects(mockProjects.map(p => p.id))
    } else {
      setSelectedProjects([])
    }
  }

  const handleSelectProject = (projectId: string, checked: boolean) => {
    if (checked) {
      setSelectedProjects(prev => [...prev, projectId])
    } else {
      setSelectedProjects(prev => prev.filter(id => id !== projectId))
    }
  }

  return (
    <div className="space-y-4 p-4">
      {/* 검색 및 필터 섹션 */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex flex-1 gap-2 items-center min-w-0">
          <div className="relative w-full max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <Input
              placeholder="프로젝트 검색..."
              className="pl-9 text-sm"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {[
              { value: '', label: '전체', color: 'bg-gray-100 text-gray-700' },
              { value: 'active', label: '진행중', color: 'bg-green-100 text-green-700' },
              { value: 'completed', label: '완료', color: 'bg-blue-100 text-blue-700' },
              { value: 'archived', label: '보관됨', color: 'bg-gray-200 text-gray-500' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => handleStatusChange(item.value)}
                className={`
                  px-4 py-1 rounded-full text-sm font-medium transition
                  ${filter.status === item.value
                    ? `${item.color} ring-2 ring-primary`
                    : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50'}
                `}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <Button className="whitespace-nowrap">+ 새 프로젝트 만들기</Button>
      </div>

      {/* 프로젝트 목록 */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <Checkbox
                  checked={selectedProjects.length === mockProjects.length}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">이름</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">진행률</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">담당자</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">목표일</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockProjects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selectedProjects.includes(project.id)}
                    onCheckedChange={(checked) => handleSelectProject(project.id, checked as boolean)}
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-pointer underline underline-offset-2">{project.name}</span>
                      </TooltipTrigger>
                      <TooltipContent>{project.description}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900"><Progress value={project.progress} /></td>
                <td className="px-4 py-3 text-sm text-gray-900">{project.owner.name}</td>
                <td className="px-4 py-3 text-sm text-gray-900">-</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    project.status === 'active' ? 'bg-green-100 text-green-700' :
                    project.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {project.status === 'active' ? '진행중' :
                     project.status === 'completed' ? '완료' : '보관됨'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <Pagination page={page} total={totalPages} onPageChange={setPage} />
    </div>
  )
} 
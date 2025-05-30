import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Project, ProjectFilter } from "@/types/project"
import { Checkbox } from "@/components/ui/checkbox"

// 임시 데이터
const mockProjects: Project[] = [
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
    tags: ["신규", "서비스"]
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
    tags: ["개선", "시스템"]
  }
]

export function ProjectsPage() {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [filter, setFilter] = useState<ProjectFilter>({})

  const handleSearch = (value: string) => {
    setFilter(prev => ({ ...prev, search: value }))
  }

  const handleStatusChange = (value: Project['status']) => {
    setFilter(prev => ({ ...prev, status: value }))
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
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 flex gap-4">
          <Input
            placeholder="프로젝트 검색..."
            className="max-w-sm"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Select
            value={filter.status}
            onValueChange={handleStatusChange}
            className="w-40"
          >
            <option value="">전체 상태</option>
            <option value="active">진행중</option>
            <option value="completed">완료</option>
            <option value="archived">보관됨</option>
          </Select>
        </div>
        <Button>+ 새 프로젝트 만들기</Button>
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
                <td className="px-4 py-3 text-sm text-gray-900">{project.name}</td>
                <td className="px-4 py-3 text-sm text-gray-900">-</td>
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
                  <span>0%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center gap-2">
        <Button variant="outline" size="sm">이전</Button>
        <Button variant="outline" size="sm">1</Button>
        <Button variant="outline" size="sm">2</Button>
        <Button variant="outline" size="sm">3</Button>
        <Button variant="outline" size="sm">다음</Button>
      </div>
    </div>
  )
} 
import { useState } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import type { Status } from "@/types/status"
import type { Issue } from "@/types/issue"

// 상태와 이슈 상태 매핑
const statusToIssueStatus: Record<string, Issue['status']> = {
  "1": "open",
  "2": "in_progress",
  "3": "resolved",
  "4": "closed"
}

const issueStatusToStatus: Record<Issue['status'], string> = {
  "open": "1",
  "in_progress": "2",
  "resolved": "3",
  "closed": "4"
}

// 임시 데이터
const mockStatuses: Status[] = [
  {
    id: "1",
    name: "할 일",
    color: "#3b82f6",
    order: 1,
    createdAt: "2024-03-20",
    updatedAt: "2024-03-20"
  },
  {
    id: "2",
    name: "진행중",
    color: "#f59e0b",
    order: 2,
    createdAt: "2024-03-20",
    updatedAt: "2024-03-20"
  },
  {
    id: "3",
    name: "검토중",
    color: "#8b5cf6",
    order: 3,
    createdAt: "2024-03-20",
    updatedAt: "2024-03-20"
  },
  {
    id: "4",
    name: "완료",
    color: "#10b981",
    order: 4,
    createdAt: "2024-03-20",
    updatedAt: "2024-03-20"
  }
]

// 임시 이슈 데이터
const mockIssues: Issue[] = [
  {
    id: "1",
    title: "로그인 기능 구현",
    description: "사용자 인증 시스템 구현",
    projectId: "1",
    projectName: "프로젝트 A",
    reporter: { id: "1", name: "홍길동", email: "hong@example.com" },
    assignee: { id: "2", name: "김철수", email: "kim@example.com" },
    status: "open",
    priority: "high",
    type: "task",
    createdAt: "2024-03-20",
    updatedAt: "2024-03-20",
    labels: ["frontend", "auth"]
  },
  {
    id: "2",
    title: "데이터베이스 설계",
    description: "ERD 작성 및 테이블 설계",
    projectId: "1",
    projectName: "프로젝트 A",
    reporter: { id: "2", name: "김철수", email: "kim@example.com" },
    assignee: { id: "3", name: "이영희", email: "lee@example.com" },
    status: "in_progress",
    priority: "medium",
    type: "task",
    createdAt: "2024-03-20",
    updatedAt: "2024-03-20",
    labels: ["backend", "database"]
  },
  {
    id: "3",
    title: "UI 디자인 리뷰",
    description: "메인 페이지 디자인 검토",
    projectId: "2",
    projectName: "프로젝트 B",
    reporter: { id: "3", name: "이영희", email: "lee@example.com" },
    assignee: { id: "1", name: "홍길동", email: "hong@example.com" },
    status: "resolved",
    priority: "low",
    type: "task",
    createdAt: "2024-03-20",
    updatedAt: "2024-03-20",
    labels: ["design", "frontend"]
  }
]

export function StatusPage() {
  const [statuses, setStatuses] = useState<Status[]>(mockStatuses)
  const [issues, setIssues] = useState<Issue[]>(mockIssues)
  const [editingStatus, setEditingStatus] = useState<Status | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = issues.findIndex((issue) => issue.id === active.id)
      const newIndex = issues.findIndex((issue) => issue.id === over.id)
      const targetStatus = statuses[Math.floor(newIndex / issues.length)]
      
      setIssues((items) => {
        const newItems = arrayMove(items, oldIndex, newIndex)
        return newItems.map((item) => ({
          ...item,
          status: statusToIssueStatus[targetStatus.id]
        }))
      })
    }

    setActiveId(null)
  }

  const handleCreateStatus = () => {
    setEditingStatus(null)
    setIsDialogOpen(true)
  }

  const handleEditStatus = (status: Status) => {
    setEditingStatus(status)
    setIsDialogOpen(true)
  }

  const handleDeleteStatus = (statusId: string) => {
    setStatuses(prev => prev.filter(s => s.id !== statusId))
  }

  const handleSaveStatus = (status: Partial<Status>) => {
    if (editingStatus) {
      setStatuses(prev => prev.map(s => 
        s.id === editingStatus.id ? { ...s, ...status } : s
      ))
    } else {
      const newStatus: Status = {
        id: Math.random().toString(36).substr(2, 9),
        name: status.name || "",
        color: status.color || "#3b82f6",
        order: statuses.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setStatuses(prev => [...prev, newStatus])
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">상태 관리</h2>
        <Button onClick={handleCreateStatus}>+ 새 상태 추가</Button>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-4 gap-4">
          {statuses.map((status) => (
            <div
              key={status.id}
              className="bg-white rounded-lg shadow p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <Badge
                  style={{ backgroundColor: status.color }}
                  className="text-white"
                >
                  {status.name}
                </Badge>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditStatus(status)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteStatus(status.id)}
                  >
                    삭제
                  </Button>
                </div>
              </div>

              <SortableContext
                items={issues.filter(issue => issueStatusToStatus[issue.status] === status.id)}
                strategy={horizontalListSortingStrategy}
              >
                <div className="space-y-2">
                  {issues
                    .filter(issue => issueStatusToStatus[issue.status] === status.id)
                    .map(issue => (
                      <div
                        key={issue.id}
                        className="p-3 bg-gray-50 rounded-lg cursor-move"
                      >
                        <h3 className="font-medium">{issue.title}</h3>
                        <p className="text-sm text-gray-500">{issue.description}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="secondary">{issue.priority}</Badge>
                          <Badge variant="outline">{issue.type}</Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="p-3 bg-white rounded-lg shadow-lg">
              {issues.find(issue => issue.id === activeId)?.title}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingStatus ? "상태 수정" : "새 상태 추가"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">이름</label>
              <Input
                defaultValue={editingStatus?.name}
                placeholder="상태 이름을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">색상</label>
              <Input
                type="color"
                defaultValue={editingStatus?.color}
                className="w-full h-10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              onClick={() => handleSaveStatus({
                name: "새 상태",
                color: "#3b82f6"
              })}
            >
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
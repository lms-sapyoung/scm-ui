import React, { useState } from "react"
import {
  DndContext,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from "@dnd-kit/core"
import { Button } from "@/components/ui/button"
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { format, differenceInCalendarDays, isBefore, isToday } from 'date-fns'
import { Bug, Wrench, Sparkles, CheckCircle, User } from "lucide-react"

const initialStatuses = [
  { id: "1", name: "할 일", color: "#3b82f6", order: 1 },
  { id: "2", name: "진행중", color: "#f59e0b", order: 2 },
  { id: "3", name: "검토중", color: "#8b5cf6", order: 3 },
  { id: "4", name: "완료", color: "#10b981", order: 4 },
];

const initialIssues = {
  "1": [
    {
      id: "1", title: "로그인 기능 구현", description: "사용자 인증 시스템 구현", projectId: "1",
      assignee: { id: "1", name: "홍길동" }, priority: "high", type: "task",
      dueDate: new Date(Date.now() + 86400000),
    },
    {
      id: "2", title: "UI 디자인 리뷰", description: "메인 페이지 디자인 검토", projectId: "2",
      assignee: { id: "3", name: "이영희" }, priority: "low", type: "improvement",
      dueDate: new Date(),
    },
  ],
  "2": [
    {
      id: "3", title: "데이터베이스 설계", description: "ERD 작성 및 테이블 설계", projectId: "1",
      assignee: { id: "2", name: "김철수" }, priority: "medium", type: "bug",
      dueDate: new Date(Date.now() - 86400000),
    },
  ],
  "3": [],
  "4": [],
};

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

type Status = typeof initialStatuses[number]
type Issue = typeof initialIssues["1"][number]

type IssuesByStatus = Record<string, Issue[]>

function DraggableCard({ issue, statusId }: { issue: Issue; statusId: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: issue.id,
    data: { fromStatus: statusId },
  });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 100, opacity: 0.8 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`bg-white rounded shadow p-3 flex flex-col gap-2 border cursor-move mb-2 ${isDragging ? 'ring-2 ring-primary' : ''}`}
    >
      <div className="flex items-center gap-2">
        <Badge className={`flex items-center ${typeMap[issue.type as keyof typeof typeMap].color}`}>
          {typeMap[issue.type as keyof typeof typeMap].icon}
          {typeMap[issue.type as keyof typeof typeMap].label}
        </Badge>
        <span className={`flex items-center gap-1 ${priorityMap[issue.priority as keyof typeof priorityMap].color}`}>
          {priorityMap[issue.priority as keyof typeof priorityMap].icon}
        </span>
        <span className="ml-auto flex items-center gap-1 text-xs text-gray-500">
          <User className="w-4 h-4" />
          {issue.assignee?.name}
        </span>
      </div>
      <div className="font-semibold text-base truncate">{issue.title}</div>
      <div className="text-xs text-gray-500 truncate">{issue.description}</div>
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
  );
}

function DroppableColumn({ status, issues, children }: { status: Status; issues: Issue[]; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: status.id });
  return (
    <div
      ref={setNodeRef}
      className={`bg-white rounded-lg shadow flex flex-col w-72 min-w-[260px] max-w-xs p-3 mr-4 ${isOver ? 'ring-2 ring-blue-400' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: status.color }} />
          <span className="font-semibold text-base">{status.name}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

interface StatusPageProps {
  selectedProjectId: string;
}

export default function StatusPage({ selectedProjectId }: StatusPageProps) {
  const [columns, setColumns] = useState<IssuesByStatus>(initialIssues);

  // 프로젝트별 이슈만 추출
  const filteredColumns: IssuesByStatus = {};
  for (const statusId of Object.keys(columns)) {
    filteredColumns[statusId] = columns[statusId].filter(issue => issue.projectId === selectedProjectId);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const fromStatus = active.data.current?.fromStatus;
    const toStatus = over.id;
    if (!fromStatus || !toStatus || fromStatus === toStatus) return;

    setColumns((prev) => {
      const moving = prev[fromStatus].find((i) => i.id === active.id);
      if (!moving) return prev;
      return {
        ...prev,
        [fromStatus]: prev[fromStatus].filter((i) => i.id !== active.id),
        [toStatus]: [...prev[toStatus], moving],
      };
    });
  }

  return (
    <div className="overflow-x-auto pb-4">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 min-w-[700px] md:min-w-full">
          {initialStatuses.map((status) => (
            <DroppableColumn key={status.id} status={status} issues={filteredColumns[status.id]}>
              {filteredColumns[status.id].length === 0 && (
                <div className="text-gray-400 text-center py-8 select-none">작업이 없습니다</div>
              )}
              {filteredColumns[status.id].map((issue) => (
                <DraggableCard key={issue.id} issue={issue} statusId={status.id} />
              ))}
            </DroppableColumn>
          ))}
        </div>
      </DndContext>
    </div>
  );
} 
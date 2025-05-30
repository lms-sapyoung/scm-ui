import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Editor } from '@/components/ui/editor'
import { Badge } from '@/components/ui/badge'
import { Bug, CheckCircle2, AlertCircle, Tag, User, MoreHorizontal } from 'lucide-react'
import type { Issue } from '@/types/issue'
import type { ReactNode } from 'react'

interface CreateIssueDialogProps {
  projectId: string
  children?: ReactNode
}

export function CreateIssueDialog({ projectId, children }: CreateIssueDialogProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [newIssue, setNewIssue] = useState<Partial<Issue>>({
    type: 'task',
    status: 'open',
    priority: 'medium',
    labels: [],
  })

  const handleCreate = () => {
    // TODO: API 호출로 변경
    console.log('새 이슈 생성:', { ...newIssue, projectId })
    setOpen(false)
    // 생성 후 해당 이슈 페이지로 이동
    // navigate(`/issues/${newIssueId}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? children : (
          <Button>새 이슈</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>새 이슈 생성</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 items-start">
          {/* 제목 */}
          <div>
            <Input
              value={newIssue.title || ''}
              onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
              placeholder="이슈 제목을 입력하세요"
              className="text-lg font-medium"
            />
          </div>

          {/* 설명 */}
          <div>
            <Editor
              content={newIssue.description || ''}
              onChange={(content) => setNewIssue({ ...newIssue, description: content })}
              placeholder="이슈에 대한 설명을 입력하세요..."
            />
          </div>

          {/* Linear-style 툴바 */}
          <div className="flex items-center gap-1 pt-2 w-[520px] justify-start">
            <Select
              value={newIssue.status}
              onValueChange={(value) => setNewIssue({ ...newIssue, status: value as Issue['status'] })}
            >
              <SelectTrigger className="h-7 px-2 text-xs rounded border border-input bg-background hover:bg-muted focus:ring-2 focus:ring-ring focus:outline-none flex items-center gap-1 min-w-[72px]">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">할 일</SelectItem>
                <SelectItem value="in_progress">진행중</SelectItem>
                <SelectItem value="resolved">검토중</SelectItem>
                <SelectItem value="closed">완료</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={newIssue.priority}
              onValueChange={(value) => setNewIssue({ ...newIssue, priority: value as Issue['priority'] })}
            >
              <SelectTrigger className="h-7 px-2 text-xs rounded border border-input bg-background hover:bg-muted focus:ring-2 focus:ring-ring focus:outline-none flex items-center gap-1 min-w-[72px]">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                <SelectValue placeholder="우선순위" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">낮음</SelectItem>
                <SelectItem value="medium">보통</SelectItem>
                <SelectItem value="high">높음</SelectItem>
                <SelectItem value="urgent">긴급</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={newIssue.assignee?.name || ''}
              onValueChange={(value) => setNewIssue({
                ...newIssue,
                assignee: { ...newIssue.assignee!, name: value }
              })}
            >
              <SelectTrigger className="h-7 px-2 text-xs rounded border border-input bg-background hover:bg-muted focus:ring-2 focus:ring-ring focus:outline-none flex items-center gap-1 min-w-[110px] whitespace-nowrap">
                <User className="w-3.5 h-3.5 mr-1" />
                <SelectValue placeholder="담당자" className="whitespace-nowrap" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="홍길동">홍길동</SelectItem>
                <SelectItem value="김철수">김철수</SelectItem>
                <SelectItem value="이영희">이영희</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={newIssue.type}
              onValueChange={(value) => setNewIssue({ ...newIssue, type: value as Issue['type'] })}
            >
              <SelectTrigger className="h-7 px-2 text-xs rounded border border-input bg-background hover:bg-muted focus:ring-2 focus:ring-ring focus:outline-none flex items-center gap-1 min-w-[72px]">
                <Bug className="w-3.5 h-3.5 mr-1" />
                <SelectValue placeholder="유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">버그</SelectItem>
                <SelectItem value="feature">기능</SelectItem>
                <SelectItem value="task">작업</SelectItem>
                <SelectItem value="improvement">개선</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={newIssue.labels?.join(', ') || ''}
              onValueChange={(value) => setNewIssue({ ...newIssue, labels: value.split(',').map(label => label.trim()) })}
            >
              <SelectTrigger className="h-7 px-2 text-xs rounded border border-input bg-background hover:bg-muted focus:ring-2 focus:ring-ring focus:outline-none flex items-center gap-1 min-w-[72px]">
                <Tag className="w-3.5 h-3.5 mr-1" />
                <SelectValue placeholder="라벨" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="frontend">프론트엔드</SelectItem>
                <SelectItem value="backend">백엔드</SelectItem>
                <SelectItem value="design">디자인</SelectItem>
                <SelectItem value="bug">버그</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="h-7 px-2 text-xs rounded border border-input bg-background hover:bg-muted flex items-center gap-1 min-w-[32px]">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button onClick={handleCreate}>
            생성
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 